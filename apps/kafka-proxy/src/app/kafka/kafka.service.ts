import { Injectable } from '@nestjs/common';
import { CompressionTypes, Kafka, logLevel, RecordMetadata } from 'kafkajs';

@Injectable()
export class KafkaService {
  readonly kafka = new Kafka({
    logLevel: logLevel.DEBUG,
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

  send<T>(topic: string, key: string, data: T): Promise<RecordMetadata[]> {
    return this.producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [{ key, value: JSON.stringify(data) }],
    });
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
}
