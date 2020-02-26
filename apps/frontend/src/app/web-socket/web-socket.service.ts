import { EventName } from '@talus/model';
import { fromEvent, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import io from 'socket.io-client';

export class WebSocketService {
  private readonly socket: SocketIOClient.Socket;

  private readonly connectionStatusSubject = new Subject<boolean>();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  socketId$ = this.connectionStatus$.pipe(
    map(() => this.socket.id),
    distinctUntilChanged(),
  );

  constructor(uri: string) {
    this.socket = io.connect(uri);

    this.registerConnectionEvents();
  }

  listen<T>(eventName: EventName): Observable<T> {
    return fromEvent<T>(this.socket, eventName);
  }

  emit<T>(eventName: string, data?: T, ackCallback?: (ackData: any) => void): void {
    ackCallback
      ? // if `ackCallback` undefined, array [{...action}, null] gets emitted
        // instead of only the `action` object.
        this.socket.emit(eventName, data, ackCallback)
      : this.socket.emit(eventName, data);
  }

  emitAndListen<DataType, ResultType = DataType>(
    eventName: EventName,
    data?: DataType,
  ): Observable<ResultType> {
    this.emit(eventName, data);

    return this.listen<ResultType>(eventName);
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
