import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { wentOffline, wentOnline } from './app.actions';
import { AppEffects } from './app.effects';
import * as fromApp from './app.reducer';
import { removeVoxel } from './scene-viewer-container/scene-viewer-container.actions';
import { initialMockState } from './testing';
import { KafkaProxyService } from './web-socket/kafka-proxy.service';

@Injectable()
class KafkaProxyServiceMock {
  logAction(): void {
    return;
  }

  listenToActions(): Observable<Action> {
    return of(removeVoxel({ xyz: [0, 0, 0], needsSync: true }));
  }
}

describe('AppEffects', () => {
  let actions$: Observable<Action>;
  let effects: AppEffects;
  let kafkaProxyService: KafkaProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        { provide: KafkaProxyService, useClass: KafkaProxyServiceMock },
        provideMockStore<fromApp.State>({
          initialState: initialMockState,
        }),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AppEffects);
    kafkaProxyService = TestBed.inject(KafkaProxyService);

    Object.defineProperty(navigator, 'onLine', { value: false });
  });

  it('should dispatch `wentOnline` action', () => {
    const expected = hot('a', {
      a: wentOnline(),
    });

    expect(effects.onlineStateChange$).toBeObservable(expected);
  });

  it('should dispatch `wentOffline` action', () => {
    const expected = hot('a', {
      a: wentOffline(),
    });

    expect(effects.onlineStateChange$).toBeObservable(expected);
  });

  it('should log action', () => {
    spyOn(kafkaProxyService, 'logAction');

    actions$ = hot('r', {
      r: removeVoxel({ xyz: [0, 0, 0], needsSync: true }),
    });

    expect(effects.needsSyncActions$).toBeObservable(actions$);

    expect(kafkaProxyService.logAction).toBeCalledTimes(1);
  });

  it(`should set 'needsSync' to false`, () => {
    spyOn(kafkaProxyService, 'listenToActions');

    const expected$ = hot('(r|)', {
      r: removeVoxel({ xyz: [0, 0, 0], needsSync: false }),
    });

    expect(effects.emitActions$).toBeObservable(expected$);
  });
});
