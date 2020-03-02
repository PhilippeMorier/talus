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
import { EventName } from '@talus/model';
import { notNil } from '@talus/shared';
import { Consumer, RecordMetadata } from 'kafkajs';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { flatMap, map, tap } from 'rxjs/operators';
import { Client, Server, Socket } from 'socket.io';
import { KafkaService } from './kafka.service';

@WebSocketGateway({ namespace: 'kafka' })
export class KafkaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  consumers: Map<string, Consumer> = new Map<string, Consumer>();

  constructor(private readonly kafkaService: KafkaService) {}

  handleConnection(client: Client): void {
    console.log('New connection:', client.id);
  }

  handleDisconnect(client: Client): void {
    console.log('Close connection:', client.id);

    this.consumers.delete(client.id);
    this.kafkaService.disconnect().then();
  }

  @SubscribeMessage(EventName.SyncAction)
  async syncAction(
    @MessageBody() { action, topic }: { action: Action; topic: string },
    @ConnectedSocket() client: Socket,
  ): Promise<RecordMetadata[]> {
    console.log(`Action '${action.type}' for topic '${topic}' from '${client.id}' received.`);

    // https://github.com/tulios/kafkajs/issues/36#issuecomment-449953932

    return this.kafkaService.send(topic, 'action', action, { clientId: client.id });
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
  ): Observable<WsResponse<Action>> {
    const consumer$ = this.getExistingOrNewConsumer(socket.id);

    return consumer$.pipe(
      tap(consumer => this.consumers.set(socket.id, consumer)),
      flatMap(consumer => {
        // The consumer group must have no running instances when performing the reset.
        // https://kafka.js.org/docs/admin#a-name-reset-offsets-a-reset-consumer-group-offsets
        return fromPromise(consumer.stop()).pipe(
          flatMap(() => this.kafkaService.resetOffsets(socket.id, topic)),
          flatMap(() => this.kafkaService.runConsumer(consumer, topic)),
        );
      }),
      map(action => ({ event: EventName.ConsumeTopic, data: action })),
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

  private getExistingOrNewConsumer(socketId: string): Observable<Consumer> {
    return this.consumers.has(socketId)
      ? of(this.consumers.get(socketId)).pipe(notNil())
      : fromPromise(this.kafkaService.createConsumer(socketId));
  }
}
