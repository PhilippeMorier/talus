import { KafkaMessage } from 'kafkajs';

export interface DecodedKafkaMessage<T> {
  headers: {
    socketId?: string;
  };
  key: string;
  offset: number;
  value: T;
}

export function fromKafkaMessage<T>(message: KafkaMessage): DecodedKafkaMessage<T> {
  return {
    key: message.key.toString(),
    value: message.value ? JSON.parse(message.value.toString()) : '',
    headers: { socketId: message.headers && message.headers['socketId'].toString() },
    offset: Number(message.offset),
  };
}
