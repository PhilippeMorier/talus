import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { fromEvent, merge, of } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { wentOffline, wentOnline } from './app.actions';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}

  // @source: https://indepth.dev/start-using-ngrx-effects-for-this/#1externalsources
  onlineStateChange$ = createEffect(() => {
    return merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
    ).pipe(map(isOnline => (isOnline ? wentOnline() : wentOffline())));
  });
}
