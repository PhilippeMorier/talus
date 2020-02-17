import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { fromEvent, Observable, Subject } from 'rxjs';
import io from 'socket.io-client';

@Injectable()
export class WebSocketService {
  private readonly socket: SocketIOClient.Socket;

  private readonly connectionStatusSubject = new Subject<boolean>();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  private readonly uri: string = 'ws://localhost:3333';

  constructor() {
    this.socket = io(this.uri);

    this.registerConnectionEvents();
  }

  listen(eventName: string): Observable<unknown> {
    return fromEvent(this.socket, eventName);
  }

  emit(eventName: string, action: Action): void {
    this.socket.emit(eventName, action);
  }

  private registerConnectionEvents(): void {
    this.socket.on('connect_error', () => {
      this.connectionStatusSubject.next(this.socket.connected);
    });
    this.socket.on('connect', () => {
      this.connectionStatusSubject.next(this.socket.connected);
    });
    this.socket.on('disconnect', () => {
      this.connectionStatusSubject.next(this.socket.connected);
    });
  }
}
