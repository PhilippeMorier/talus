export class DecodedKafkaMessage<T> {
  key: string;
  value: T;
  headers: {
    socketId?: string;
  };
}
