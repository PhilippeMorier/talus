import { Module } from '@nestjs/common';
import { KafkaGateway } from './kafka.gateway';

@Module({
  providers: [KafkaGateway],
})
export class KafkaModule {}
