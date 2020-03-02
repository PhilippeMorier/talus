import { EventName } from '@talus/model';
import { fromEvent, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import io from 'socket.io-client';

export class WebSocketService {
  private socket: SocketIOClient.Socket;

  private readonly connectionStatusSubject = new Subject<boolean>();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  socketId$ = this.connectionStatus$.pipe(map(() => this.socket.id));

  constructor(private uri: string) {
    this.connect();
  }

  connect(): void {
    this.socket = io.connect(this.uri);
    this.registerConnectionEvents();
  }

  reconnect(): void {
    this.socket.disconnect();
    this.connect();
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
