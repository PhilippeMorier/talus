import { Module } from '@nestjs/common';
import { KafkaGateway } from './kafka.gateway';
import { KafkaService } from './kafka.service';

@Module({
  providers: [KafkaGateway, KafkaService],
})
export class KafkaModule {}
