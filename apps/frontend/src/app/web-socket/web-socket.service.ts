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

  listen<T>(eventName: string): Observable<T> {
    return fromEvent<T>(this.socket, eventName);
  }

  emit<T>(eventName: string, data: T): void {
    this.socket.emit(eventName, data);
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
