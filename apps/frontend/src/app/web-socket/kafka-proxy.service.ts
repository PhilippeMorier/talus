import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WebSocketService } from './web-socket.service';

enum EventName {
  SyncAction = 'SyncAction',
  CreateTopic = 'CreateTopic',
  DeleteTopic = 'DeleteTopic',
  TopicNames = 'TopicNames',
}

@Injectable()
export class KafkaProxyService {
  private readonly uri: string = 'ws://localhost:3333';
  private readonly webSocketService: WebSocketService;

  connectionStatus$: Observable<boolean>;
  topics$: Observable<string[]>;

  constructor() {
    this.webSocketService = new WebSocketService(this.uri);
    this.connectionStatus$ = this.webSocketService.connectionStatus$;
    this.topics$ = this.webSocketService.emitAndListen(EventName.TopicNames);
  }

  createTopic(topicName: string): void {
    this.webSocketService.emit(EventName.CreateTopic, topicName);
  }

  deleteTopic(topicName: string): void {
    this.webSocketService.emit(EventName.DeleteTopic, topicName);
  }

  syncAction(action: Action): void {
    this.webSocketService.emit(EventName.SyncAction, action);
  }

  listenToActions(): Observable<Action> {
    return this.webSocketService.listen<Action>(EventName.SyncAction);
  }
}
