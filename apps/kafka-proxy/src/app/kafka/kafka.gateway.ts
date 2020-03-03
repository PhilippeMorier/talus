import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Action } from '@ngrx/store';
import { DecodedKafkaMessage, EventName } from '@talus/model';
import { RecordMetadata } from 'kafkajs';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { flatMap, map } from 'rxjs/operators';
import { Client, Server, Socket } from 'socket.io';
import { KafkaService } from './kafka.service';

@WebSocketGateway({ namespace: 'kafka' })
export class KafkaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly kafkaService: KafkaService) {}

  handleConnection(client: Client): void {
    this.kafkaService
      .connectConsumer(client.id)
      .then(() => console.log('New connection for:', client.id));
  }

  handleDisconnect(client: Client): void {
    this.kafkaService
      .disconnectConsumer(client.id)
      .then(() => console.log('Connection closed for:', client.id));
  }

  @SubscribeMessage(EventName.SyncAction)
  async syncAction(
    @MessageBody() { action, topic }: { action: Action; topic: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<RecordMetadata[]> {
    console.log(`Action '${action.type}' for topic '${topic}' from '${socket.id}' received.`);

    return this.kafkaService.send(topic, 'action', action, { socketId: socket.id });
  }

  @SubscribeMessage(EventName.TopicNames)
  async topicNames(): Promise<string[]> {
    return this.getAndEmitTopicNames();
  }

  @SubscribeMessage(EventName.CreateTopic)
  async createTopics(@MessageBody() topicName: string): Promise<string[]> {
    await this.kafkaService.createTopic(topicName);

    return this.getAndEmitTopicNames();
  }

  @SubscribeMessage(EventName.ConsumeTopic)
  consumeTopic(
    @MessageBody() topic: string,
    @ConnectedSocket() socket: Socket,
  ): Observable<WsResponse<DecodedKafkaMessage<Action>>> {
    const consumer$ = fromPromise(this.kafkaService.connectConsumer(socket.id));

    return consumer$.pipe(
      flatMap(consumer => {
        // The consumer group must have no running instances when performing the reset.
        // https://kafka.js.org/docs/admin#a-name-reset-offsets-a-reset-consumer-group-offsets
        return fromPromise(consumer.stop()).pipe(
          flatMap(() => this.kafkaService.resetOffsets(socket.id, topic)),
          flatMap(() => this.kafkaService.runConsumer(consumer, topic)),
        );
      }),
      map(message => ({ event: EventName.ConsumeTopic, data: message })),
    );
  }

  /**
   * Requires `delete.topic.enable=true`, i.e.: `KAFKA_CFG_DELETE_TOPIC_ENABLE=true`
   */
  @SubscribeMessage(EventName.DeleteTopic)
  async deleteTopics(@MessageBody() topicName: string): Promise<string[]> {
    await this.kafkaService.deleteTopic(topicName);

    return this.getAndEmitTopicNames();
  }

  private async getAndEmitTopicNames(): Promise<string[]> {
    const topicNames = await this.kafkaService.getTopicNames();
    this.server.emit(EventName.TopicNames, topicNames);

    return topicNames;
  }
}
