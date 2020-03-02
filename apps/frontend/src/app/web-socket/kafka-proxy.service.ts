import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { EventName } from '@talus/model';
import { Observable, Subject } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { WebSocketService } from './web-socket.service';

export interface SyncableAction extends Action {
  needsSync: boolean;
}

@Injectable()
export class KafkaProxyService {
  private readonly uri: string = 'ws://localhost:3333/kafka';
  private readonly webSocketService: WebSocketService;

  connectionStatus$: Observable<boolean>;
  socketId$: Observable<string>;
  topics$: Observable<string[]>;
  private topicSubject = new Subject<string>();
  actions$: Observable<SyncableAction>;

  constructor() {
    this.webSocketService = new WebSocketService(this.uri);
    this.connectionStatus$ = this.webSocketService.connectionStatus$;
    this.socketId$ = this.webSocketService.socketId$;
    this.topics$ = this.webSocketService.emitAndListen(EventName.TopicNames);

    this.actions$ = this.topicSubject.pipe(
      flatMap(topic =>
        this.webSocketService.emitAndListen<string, SyncableAction>(EventName.ConsumeTopic, topic),
      ),
    );
  }

  createTopic(topicName: string): void {
    this.webSocketService.emit(EventName.CreateTopic, topicName);
  }

  deleteTopic(topicName: string): void {
    this.webSocketService.emit(EventName.DeleteTopic, topicName);
  }

  syncAction(action: Action, topic: string): void {
    this.webSocketService.emit(EventName.SyncAction, { action, topic });
  }

  setTopic(topic: string): void {
    this.topicSubject.next(topic);
  }
}
