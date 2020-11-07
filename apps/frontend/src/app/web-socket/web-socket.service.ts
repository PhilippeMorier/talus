import { EventName } from '@talus/model';
import { Observable, Subject, fromEvent } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import io from 'socket.io-client';

export class WebSocketService {
  private socket: SocketIOClient.Socket = io.Socket;

  private readonly connectionStatusSubject = new Subject<boolean>();
  connectionStatus$ = this.connectionStatusSubject.asObservable().pipe(distinctUntilChanged());

  socketId$ = this.connectionStatus$.pipe(map(() => this.socket.id));

  constructor(private uri: string) {}

  connect(): void {
    this.socket = io.connect(this.uri);
    this.registerConnectionEvents(this.socket);
  }

  reconnect(): void {
    this.socket?.disconnect();
    this.connect();
  }

  listen<T>(eventName: EventName): Observable<T> {
    return fromEvent<T>(this.socket, eventName);
  }

  emit<T>(eventName: string, data?: T): void {
    this.socket.emit(eventName, data);
  }

  emitAndListen<DataType, ResultType = DataType>(
    eventName: EventName,
    data?: DataType,
  ): Observable<ResultType> {
    this.emit(eventName, data);

    return this.listen<ResultType>(eventName);
  }

  private registerConnectionEvents(socket: SocketIOClient.Socket): void {
    socket.on('connect_error', () => {
      this.connectionStatusSubject.next(socket.connected);
    });
    socket.on('connect', () => {
      this.connectionStatusSubject.next(socket.connected);
    });
    socket.on('disconnect', () => {
      this.connectionStatusSubject.next(socket.connected);
    });
  }
}
