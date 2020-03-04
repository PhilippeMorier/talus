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
import { featureKey } from './scene-viewer-container/scene-viewer-container.reducer';
import { initialMockState } from './testing';
import { KafkaProxyService, SyncableAction } from './web-socket/kafka-proxy.service';

@Injectable()
class KafkaProxyServiceMock {
  topics$: Observable<string[]> = of([]);

  actions$: Observable<SyncableAction[]> = of([]);

  connectionStatus$: Observable<boolean> = of(true);

  createTopic(): void {
    return;
  }

  syncAction(): void {
    return;
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
          initialState: {
            ...initialMockState,
            sceneViewerContainer: { ...initialMockState[featureKey], topic: 'test-topic' },
          },
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

  it('should sync action', () => {
    spyOn(kafkaProxyService, 'syncAction');

    actions$ = hot('r', {
      r: removeVoxel({ xyz: [0, 0, 0], needsSync: true }),
    });

    expect(effects.syncActionToKafka$).toBeObservable(actions$);

    expect(kafkaProxyService.syncAction).toBeCalledTimes(1);
  });
});
