import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Action } from '@ngrx/store';
import { RecordMetadata } from 'kafkajs';
import { Server, Socket } from 'socket.io';
import { KafkaService } from './kafka.service';

@WebSocketGateway()
export class KafkaGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly kafkaService: KafkaService) {}

  @SubscribeMessage('AllActions')
  async actions(
    @MessageBody() action: Action,
    @ConnectedSocket() client: Socket,
  ): Promise<RecordMetadata[]> {
    console.log(`Action '${action.type}' from '${client.id}' received.`);
    client.broadcast.emit('AllActions', action);

    return this.kafkaService.send('test-topic', 'myKey', { myObject: 'testValue' });
  }

  @SubscribeMessage('GetTopicNames')
  async getTopicNames(): Promise<string[]> {
    return this.kafkaService.getTopicNames();
  }

  @SubscribeMessage('CreateTopic')
  async createTopics(@MessageBody() topicName: string): Promise<boolean> {
    return this.kafkaService.createTopic(topicName);
  }

  /**
   * Requires `delete.topic.enable=true`, i.e.: `KAFKA_CFG_DELETE_TOPIC_ENABLE=true`
   */
  @SubscribeMessage('DeleteTopic')
  async deleteTopics(@MessageBody() topicName: string): Promise<void> {
    return this.kafkaService.deleteTopic(topicName);
  }
}
