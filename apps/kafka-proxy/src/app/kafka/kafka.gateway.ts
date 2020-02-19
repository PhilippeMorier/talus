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
}
