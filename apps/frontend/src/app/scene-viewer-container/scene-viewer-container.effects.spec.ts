import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UiSceneViewerService } from '@talus/ui';
import { Coord } from '@talus/vdb';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { initialMockState } from '../testing';
import { GridService, VoxelChange } from './grid.service';
import { addFirstLineChange, setLineCoord, startLine } from './scene-viewer-container.actions';
import { SceneViewerContainerEffects } from './scene-viewer-container.effects';

@Injectable()
class GridServiceMock {
  setVoxel(xyz: Coord, newValue: number): VoxelChange {
    return {
      affectedNodeOrigin: [0, 0, 0],
      newValue,
      oldValue: -1,
      xyz,
    };
  }
}

describe('SceneViewerContainerEffects', () => {
  let actions$: Observable<Action>;
  let effects: SceneViewerContainerEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: GridService, useClass: GridServiceMock },
        { provide: UiSceneViewerService, useValue: {} },
        SceneViewerContainerEffects,
        provideMockActions(() => actions$),
        provideMockStore<fromApp.State>({
          initialState: initialMockState,
        }),
      ],
    });

    effects = TestBed.get(SceneViewerContainerEffects);
  });

  it(`should dispatch 'startLine' after 'setLineCoord'`, () => {
    actions$ = hot('a', { a: setLineCoord({ xyz: [0, 0, 0], newValue: 42 }) });

    const expectedStartLine$ = hot('s', {
      s: startLine({ xyz: [0, 0, 0], newValue: 42 }),
    });

    expect(effects.setLineCord$).toBeObservable(expectedStartLine$);
  });

  it(`should dispatch 'addFirstLineChange' after 'startLine'`, () => {
    actions$ = hot('a', { a: startLine({ xyz: [0, 0, 0], newValue: 42 }) });

    const expectedStartLine$ = hot('a', {
      a: addFirstLineChange({
        affectedNodeOrigin: [0, 0, 0],
        newValue: 42,
        oldValue: -1,
        xyz: [0, 0, 0],
      }),
    });

    expect(effects.startLine$).toBeObservable(expectedStartLine$);
  });
});
