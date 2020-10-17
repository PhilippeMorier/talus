import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { fromEvent, merge, of } from 'rxjs';
import { filter, map, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  updateConnectionStatus,
  updateLastLoadedMessageOffset,
  updateTopics,
  wentOffline,
  wentOnline,
} from './app.actions';
import * as fromApp from './app.reducer';
import { KafkaProxyService, SyncableAction } from './web-socket/kafka-proxy.service';

@Injectable()
export class AppEffects {
  constructor(
    private readonly actions$: Actions<SyncableAction>,
    private readonly kafkaProxyService: KafkaProxyService,
    private readonly store: Store<fromApp.State>,
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
        withLatestFrom(this.store.pipe(select(fromApp.selectSceneViewerContainerState))),
        tap(
          ([action, state]) =>
            state.topic && this.kafkaProxyService.syncAction(action, state.topic),
        ),
        // Map it to single action just for making testing easier
        map(([action]) => action),
      ),
    { dispatch: false },
  );

  emitActionFromKafka$ = createEffect(() =>
    this.kafkaProxyService.messages$.pipe(
      switchMap(message => {
        return [
          { ...message.value, needsSync: false },
          updateLastLoadedMessageOffset({ offset: message.offset }),
        ];
      }),
    ),
  );

  updateTopics$ = createEffect(() =>
    this.kafkaProxyService.topics$.pipe(map(topics => updateTopics({ topics }))),
  );

  updateConnectionStatus$ = createEffect(() =>
    this.kafkaProxyService.connectionStatus$.pipe(
      map(connectedKafkaProxy =>
        updateConnectionStatus({ isConnectedToKafkaProxy: connectedKafkaProxy }),
      ),
    ),
  );
}
