import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { DecodedKafkaMessage, EventName, Topic } from '@talus/model';
import { Observable, Subject } from 'rxjs';
import { filter, flatMap, map, withLatestFrom } from 'rxjs/operators';
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
  topics$: Observable<Topic[]>;
  private topicSubject = new Subject<string>();
  actions$: Observable<SyncableAction>;

  constructor() {
    this.webSocketService = new WebSocketService(this.uri);
    this.webSocketService.connect();
    this.connectionStatus$ = this.webSocketService.connectionStatus$;
    this.socketId$ = this.webSocketService.socketId$;
    this.topics$ = this.webSocketService
      .emitAndListen<void, Topic[]>(EventName.TopicNames)
      // https://kafka.apache.org/0110/documentation.html#impl_offsettracking
      .pipe(map(topics => topics.filter(topic => topic.name !== '__consumer_offsets')));

    this.actions$ = this.topicSubject.pipe(
      flatMap(topic =>
        this.webSocketService.emitAndListen<string, DecodedKafkaMessage<SyncableAction>>(
          EventName.ConsumeTopic,
          topic,
        ),
      ),
      withLatestFrom(this.socketId$),
      filter(([message, socketId]) => socketId !== message.headers.socketId),
      map(([message, _socketId]) => message.value),
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
    // Reconnect to get a new socket-id so all the messages from the topic get received
    this.webSocketService.reconnect();
    this.topicSubject.next(topic);
  }
}
