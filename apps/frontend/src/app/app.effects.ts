import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { fromEvent, merge, of } from 'rxjs';
import { filter, map, mapTo, tap } from 'rxjs/operators';
import { wentOffline, wentOnline } from './app.actions';
import { KafkaProxyService } from './web-socket/kafka-proxy.service';

export interface SyncableAction extends Action {
  needsSync: boolean;
}

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

  needsSyncActions$ = createEffect(
    () =>
      this.actions$.pipe(
        filter(action => action.needsSync),
        tap(action => this.kafkaProxyService.logAction(action)),
      ),
    { dispatch: false },
  );

  emitActions$ = createEffect(() => new Actions(this.kafkaProxyService.listenToActions()));
}
