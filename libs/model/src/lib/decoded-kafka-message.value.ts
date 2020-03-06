import { KafkaMessage } from 'kafkajs';

export class DecodedKafkaMessage<T> {
  headers: {
    socketId?: string;
  };
  key: string;
  offset: number;
  value: T;

  static fromKafkaMessage<T>(message: KafkaMessage): DecodedKafkaMessage<T> {
    return {
      key: message.key.toString(),
      value: JSON.parse(message.value.toString()),
      headers: { socketId: message.headers && message.headers['socketId'].toString() },
      offset: Number(message.offset),
    };
  }
}
