import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import io from 'socket.io-client';

@Injectable()
export class WebSocketService {
  private readonly socket: SocketIOClient.Socket;

  private readonly connectedSubject = new Subject<boolean>();
  connected$ = this.connectedSubject.asObservable();

  private readonly uri: string = 'ws://localhost:3333';

  constructor() {
    this.socket = io(this.uri);

    this.registerConnectionEvents();
  }

  listen(eventName: string): Observable<unknown> {
    return new Observable(subscriber => {
      this.socket.on(eventName, data => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, action: Action): void {
    this.socket.emit(eventName, action);
  }

  private registerConnectionEvents(): void {
    this.socket.on('connect_error', () => {
      this.connectedSubject.next(this.socket.connected);
    });
    this.socket.on('connect', () => {
      this.connectedSubject.next(this.socket.connected);
    });
    this.socket.on('disconnect', () => {
      this.connectedSubject.next(this.socket.connected);
    });
  }
}
