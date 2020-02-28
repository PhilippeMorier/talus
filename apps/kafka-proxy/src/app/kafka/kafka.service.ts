import { Injectable } from '@nestjs/common';
import { Action } from '@ngrx/store';
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

  readonly producer = this.kafka.producer();
  readonly admin = this.kafka.admin();

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
  ): Observable<Action> {
    const subscribe$ = fromPromise(consumer.subscribe({ topic, fromBeginning }));

    const runEachMessage$ = new Observable<EachMessagePayload>(subscriber => {
      consumer.run({ eachMessage: async payload => subscriber.next(payload) });
    });

    return subscribe$.pipe(
      flatMap(() => runEachMessage$),
      map(messagePayload => JSON.parse(messagePayload.message.value.toString())),
    );
  }

  resetOffsets(groupId: string, topic: string): Observable<void> {
    return fromPromise(this.admin.resetOffsets({ groupId, topic, earliest: true }));
  }

  disconnect(): Promise<void> {
    return this.producer.disconnect();
  }

  async getTopicNames(): Promise<string[]> {
    const { topics } = await this.admin.fetchTopicMetadata({ topics: [] });

    return topics.map(topic => topic.name);
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
}
