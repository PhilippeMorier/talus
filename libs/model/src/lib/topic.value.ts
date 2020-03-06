export class Topic {
  name: string;
  offsets: KafkaTopicOffset[];
}

interface KafkaTopicOffset {
  partition: number;
  offset: number;
  high: number;
  low: number;
}
