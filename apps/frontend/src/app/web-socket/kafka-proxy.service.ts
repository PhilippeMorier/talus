import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { WebSocketService } from './web-socket.service';

enum EventName {
  AllActions = 'AllActions',
}

@Injectable()
export class KafkaProxyService {
  private readonly uri: string = 'ws://localhost:3333';
  private readonly webSocketService: WebSocketService;

  connectionStatus$: Observable<boolean>;

  constructor() {
    this.webSocketService = new WebSocketService(this.uri);
    this.connectionStatus$ = this.webSocketService.connectionStatus$;
  }

  logAction(action: Action): void {
    this.webSocketService.emit(EventName.AllActions, action);
  }

  listenToActions(): Observable<Action> {
    return this.webSocketService.listen<[Action, string]>(EventName.AllActions).pipe(
      withLatestFrom(this.webSocketService.socketId$),
      filter(([[_action, id], socketId]) => id !== socketId),
      map(([[action, _id], _socketId]) => {
        action['needsSync'] = false;
        return action;
      }),
    );
  }
}
