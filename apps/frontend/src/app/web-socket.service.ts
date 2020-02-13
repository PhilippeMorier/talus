import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class WebSocketService {
  socket: any;

  private readonly uri: string = 'ws://localhost:3333';

  constructor() {
    this.socket = io(this.uri);
  }

  listen(eventName: string): Observable<unknown> {
    return new Observable(subscriber => {
      this.socket.on(eventName, data => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
