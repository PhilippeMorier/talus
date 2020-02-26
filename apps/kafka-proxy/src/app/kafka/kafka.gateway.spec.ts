import { INestApplication, Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventName } from '@talus/model';
import { of } from 'rxjs';
import io from 'socket.io-client';
import { KafkaGateway } from './kafka.gateway';
import { KafkaService } from './kafka.service';

@Injectable()
class KafkaServiceMock {
  send(): void {
    return;
  }
  runConsumer(): void {
    return;
  }
  createConsumer(): void {
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
      spyOn(kafkaServiceMock, 'runConsumer').and.returnValue(of({ type: '[Test] Fake' }));
      spyOn(kafkaServiceMock, 'createConsumer').and.returnValue(
        new Promise(resolve => resolve({})),
      );

      ws = io.connect('http://localhost:3334/kafka');

      const fakeAction = { type: '[Test] Test action type' };

      ws.emit(EventName.SyncAction, fakeAction);
      ws.emit(EventName.ConsumeTopic, 'to-consume-topic');

      await new Promise(resolve =>
        ws.on(EventName.ConsumeTopic, () => {
          expect(kafkaServiceMock.send).toBeCalledWith(
            'action-topic',
            'action',
            fakeAction,
            expect.objectContaining({ clientId: expect.any(String) }),
          );

          expect(kafkaServiceMock.runConsumer).toHaveBeenCalledWith(
            expect.anything(),
            'to-consume-topic',
          );

          resolve();
        }),
      );
    });
  });
});
