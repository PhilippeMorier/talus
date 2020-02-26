import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { fromEvent, merge, of } from 'rxjs';
import { filter, map, mapTo, tap } from 'rxjs/operators';
import { updateSessions, wentOffline, wentOnline } from './app.actions';
import { KafkaProxyService, SyncableAction } from './web-socket/kafka-proxy.service';

@Injectable()
export class AppEffects {
  constructor(
    private readonly actions$: Actions<SyncableAction>,
    private readonly kafkaProxyService: KafkaProxyService,
  ) {}

  // @source: https://indepth.dev/start-using-ngrx-effects-for-this/#1externalsources
  onlineStateChange$ = createEffect(() => {
    return merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
    ).pipe(map(isOnline => (isOnline ? wentOnline() : wentOffline())));
  });

  syncActionToKafka$ = createEffect(
    () =>
      this.actions$.pipe(
        filter(action => action.needsSync),
        tap(action => this.kafkaProxyService.syncAction(action)),
        // tap(() => this.kafkaProxyService.createTopic('just-a-test')),
      ),
    { dispatch: false },
  );

  emitActionFromKafka$ = createEffect(() =>
    this.kafkaProxyService.actions$.pipe(
      map(action => {
        action.needsSync = false;
        return action;
      }),
    ),
  );

  updateTopics$ = createEffect(() =>
    this.kafkaProxyService.topics$.pipe(map(sessions => updateSessions({ sessions }))),
  );
}
