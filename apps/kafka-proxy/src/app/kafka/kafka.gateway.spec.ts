import { INestApplication, Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventName } from '@talus/model';
import { of } from 'rxjs';
import 'socket.io-client';
import { KafkaGateway } from './kafka.gateway';
import { KafkaService } from './kafka.service';
import io = require('socket.io-client');

@Injectable()
class KafkaServiceMock {
  send(): void {
    return;
  }
  runConsumer(): void {
    return;
  }
  connectConsumer(): void {
    return;
  }
  disconnectConsumer(): void {
    return;
  }
  resetOffsets(): void {
    return;
  }
}

describe('KafkaGateway', () => {
  let testingModule: TestingModule;
  let app: INestApplication;
  let ws: SocketIOClient.Socket;

  let kafkaServiceMock: KafkaService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [{ provide: KafkaService, useClass: KafkaServiceMock }, KafkaGateway],
    }).compile();

    app = await testingModule.createNestApplication();
    await app.listenAsync(3334);

    kafkaServiceMock = testingModule.get(KafkaService);
  });

  afterEach(() => app.close());

  describe('actions()', () => {
    // Inspired by:
    // https://github.com/nestjs/nest/blob/master/integration/websockets/e2e/gateway.spec.ts
    it('should send message to via KafkaService', async () => {
      spyOn(kafkaServiceMock, 'send');
      spyOn(kafkaServiceMock, 'connectConsumer').and.returnValue(
        Promise.resolve({ stop: () => Promise.resolve({}) }),
      );
      spyOn(kafkaServiceMock, 'disconnectConsumer').and.returnValue(
        Promise.resolve({ stop: () => Promise.resolve({}) }),
      );
      spyOn(kafkaServiceMock, 'resetOffsets').and.returnValue(of({}));
      spyOn(kafkaServiceMock, 'runConsumer').and.returnValue(of({}));

      ws = io.connect('http://localhost:3334/kafka');

      const fakeMessageBody = { action: { type: '[Test] Test action type' }, topic: 'test-topic' };

      ws.emit(EventName.SyncAction, fakeMessageBody);
      ws.emit(EventName.ConsumeTopic, 'to-consume-topic');

      await new Promise(resolve =>
        ws.on(EventName.ConsumeTopic, () => {
          expect(kafkaServiceMock.send).toBeCalledWith(
            'test-topic',
            'action',
            fakeMessageBody.action,
            expect.objectContaining({ socketId: expect.any(String) }),
          );

          expect(kafkaServiceMock.runConsumer).toHaveBeenCalledWith(
            expect.anything(),
            'to-consume-topic',
            true,
          );

          resolve();
        }),
      );
    });
  });
});
