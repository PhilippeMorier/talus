import { Injectable } from '@nestjs/common';
import { Action } from '@ngrx/store';
import { DecodedKafkaMessage, fromKafkaMessage, Topic } from '@talus/model';
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
      map(({ message }) => fromKafkaMessage(message)),
    );
  }

  resetOffsets(groupId: string, topic: string): Observable<void> {
    return fromPromise(this.admin.resetOffsets({ groupId, topic, earliest: true }));
  }

  async getTopics(): Promise<Topic[]> {
    const { topics } = await this.admin.fetchTopicMetadata({ topics: [] });

    const topicPromises = topics.map(topic => this.getTopic(topic.name));

    return Promise.all(topicPromises);
  }

  async getTopic(topicName: string): Promise<Topic> {
    const offsets = await this.admin.fetchTopicOffsets(topicName);
    return {
      name: topicName,
      offsets: offsets.map(offset => ({
        high: Number(offset.high),
        low: Number(offset.low),
        offset: Number(offset.offset),
        partition: offset.partition,
      })),
    };
  }

  async createTopic(topicName: string): Promise<boolean> {
    return this.admin.createTopics({
      topics: [{ topic: topicName, configEntries: [] }],
    });
  }

  async deleteTopic(topicName: string): Promise<void> {
    return this.admin.deleteTopics({ topics: [topicName] });
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
