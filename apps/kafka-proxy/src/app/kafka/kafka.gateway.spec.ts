import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import io from 'socket.io-client';
import { KafkaGateway } from './kafka.gateway';
import { KafkaService } from './kafka.service';

describe('KafkaGateway', () => {
  let testingModule: TestingModule;
  let app: INestApplication;
  let ws: SocketIOClient.Socket;
  let ws2: SocketIOClient.Socket;

  let kafkaService: KafkaService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [KafkaService, KafkaGateway],
    }).compile();

    app = await testingModule.createNestApplication();
    await app.listenAsync(3333);

    kafkaService = testingModule.get(KafkaService);
  });

  afterEach(() => app.close());

  describe('actions()', () => {
    it('should send message to via KafkaService', async () => {
      spyOn(kafkaService, 'send');

      ws = io.connect('http://localhost:3333');
      ws2 = io.connect('http://localhost:3333');

      ws.emit('AllActions', {
        type: '[Test] Test action type',
      });

      await new Promise(resolve =>
        ws2.on('AllActions', () => {
          expect(kafkaService.send).toBeCalledWith('test-topic', 'myKey', {
            myObject: 'testValue',
          });

          resolve();
        }),
      );
    });
  });
});
