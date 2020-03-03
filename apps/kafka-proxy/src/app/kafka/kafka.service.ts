import { Injectable } from '@nestjs/common';
import { Action } from '@ngrx/store';
import { DecodedKafkaMessage, Topic } from '@talus/model';
import {
  CompressionTypes,
  Consumer,
  EachMessagePayload,
  IHeaders,
  Kafka,
  logLevel,
  RecordMetadata,
} from 'kafkajs';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { flatMap, map } from 'rxjs/operators';

@Injectable()
export class KafkaService {
  readonly kafka = new Kafka({
    logLevel: logLevel.ERROR,
    clientId: 'kafka-proxy',
    brokers: ['localhost:29092'],
  });

  readonly producer = this.kafka.producer({
    // https://blog.softwaremill.com/does-kafka-really-guarantee-the-order-of-messages-3ca849fd19d2#f700
    maxInFlightRequests: 1,
  });
  readonly admin = this.kafka.admin();
  private readonly consumers: Map<string, Consumer> = new Map<string, Consumer>();

  constructor() {
    this.producer
      .connect()
      .then(() => console.log('Producer connected'))
      .catch(error => error);
  }

  send<T>(topic: string, key: string, data: T, headers?: IHeaders): Promise<RecordMetadata[]> {
    return this.producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [{ key, value: JSON.stringify(data), headers }],
    });
  }

  runConsumer(
    consumer: Consumer,
    topic: string,
    fromBeginning: boolean = true,
  ): Observable<DecodedKafkaMessage<Action>> {
    const subscribe$ = fromPromise(consumer.subscribe({ topic, fromBeginning }));

    const runEachMessage$ = new Observable<EachMessagePayload>(subscriber => {
      consumer.run({ eachMessage: async payload => subscriber.next(payload) });
    });

    return subscribe$.pipe(
      flatMap(() => runEachMessage$),
      map(({ message }) => {
        return {
          key: message.key.toString(),
          value: JSON.parse(message.value.toString()),
          headers: { socketId: message.headers && message.headers['socketId'].toString() },
        };
      }),
    );
  }

  resetOffsets(groupId: string, topic: string): Observable<void> {
    return fromPromise(this.admin.resetOffsets({ groupId, topic, earliest: true }));
  }

  async getTopics(): Promise<Topic[]> {
    const { topics } = await this.admin.fetchTopicMetadata({ topics: [] });

    const namesPromise = topics.map(async topic => ({
      name: topic.name,
      offsets: await this.admin.fetchTopicOffsets(topic.name),
    }));

    return this.convertToTopics(await Promise.all(namesPromise));
  }

  private convertToTopics(
    kafkaTopics: {
      name: string;
      offsets: { partition: number; offset: string; high: string; low: string }[];
    }[],
  ): Topic[] {
    return kafkaTopics.map(topic => ({
      name: topic.name,
      totalSize: topic.offsets.reduce(
        (previous, next) => previous + (Number(next.high) - Number(next.low)),
        0,
      ),
    }));
  }

  async createTopic(topicName: string): Promise<boolean> {
    return this.admin.createTopics({
      topics: [{ topic: topicName, configEntries: [] }],
    });
  }

  async deleteTopic(topicName: string): Promise<void> {
    return this.admin.deleteTopics({ topics: [topicName] });
  }

  async createConsumer(groupId: string): Promise<Consumer> {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();

    return consumer;
  }

  async connectConsumer(groupId: string): Promise<Consumer> {
    let consumer = this.consumers.get(groupId);

    if (!consumer) {
      consumer = this.kafka.consumer({ groupId });
      this.consumers.set(groupId, consumer);
    }

    await consumer.connect();

    return consumer;
  }

  async disconnectConsumer(groupId: string): Promise<void> {
    const consumer = this.consumers.get(groupId);

    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(groupId);
    }
  }
}
