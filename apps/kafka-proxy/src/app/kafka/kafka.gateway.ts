import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Kafka, logLevel } from 'kafkajs';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway()
export class KafkaGateway {
  @WebSocketServer()
  server: Server;

  readonly kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    clientId: 'kafka-proxy',
    brokers: ['localhost:29092'],
  });
  readonly producer = this.kafka.producer();

  constructor() {
    console.log(
      this.producer
        .connect()
        .then(() => console.log('Producer connected'))
        .catch(error => error),
    );
  }

  @SubscribeMessage('kafka')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    this.producer
      .send({
        topic: 'test-topic',
        messages: [{ value: JSON.stringify(data) }],
      })
      .then(() => console.log('Message sent via producer'))
      .catch(error => error);

    console.log(data);
    return interval(1000).pipe(map(item => ({ event: 'kafka', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
