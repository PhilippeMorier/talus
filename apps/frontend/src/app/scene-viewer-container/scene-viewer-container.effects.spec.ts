import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UiSceneViewerService } from '@talus/ui';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { initialMockState } from '../testing';
import { GridService, VoxelChange } from './grid.service';
import {
  addFirstLineChange,
  setLineCoord,
  setVoxel,
  setVoxelFailed,
  setVoxels,
  setVoxelsFailed,
  startLine,
  voxelSet,
  voxelsSet,
} from './scene-viewer-container.actions';
import { SceneViewerContainerEffects } from './scene-viewer-container.effects';

const VOXEL_CHANGE: VoxelChange = {
  affectedNodeOrigin: [0, 0, 0],
  newValue: 42,
  oldValue: -1,
  xyz: [0, 0, 0],
};

@Injectable()
class GridServiceMock {
  setVoxel(): VoxelChange {
    return VOXEL_CHANGE;
  }

  setVoxels(): VoxelChange[] {
    return [VOXEL_CHANGE];
  }

  computeInternalNode1Mesh(): void {
    return;
  }
}

@Injectable()
class UiSceneViewerServiceMock {
  updateNodeMesh(): void {
    return;
  }
}

describe('SceneViewerContainerEffects', () => {
  let actions$: Observable<Action>;
  let effects: SceneViewerContainerEffects;
  let gridService: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: GridService, useClass: GridServiceMock },
        { provide: UiSceneViewerService, useClass: UiSceneViewerServiceMock },
        SceneViewerContainerEffects,
        provideMockActions(() => actions$),
        provideMockStore<fromApp.State>({
          initialState: initialMockState,
        }),
      ],
    });

    effects = TestBed.get(SceneViewerContainerEffects);
    gridService = TestBed.get(GridService);
  });

  it(`should dispatch 'voxelSet' after 'setVoxel'`, () => {
    actions$ = hot('s', { s: setVoxel({ xyz: [0, 0, 0], newValue: 42 }) });

    const expectedVoxelSet$ = hot('v', {
      v: voxelSet(VOXEL_CHANGE),
    });

    expect(effects.setVoxel$).toBeObservable(expectedVoxelSet$);
  });

  it(`should dispatch 'setVoxelFailed' after 'setVoxel'`, () => {
    spyOn(gridService, 'setVoxel').and.throwError('');
    actions$ = hot('s', { s: setVoxel({ xyz: [0, 0, 0], newValue: 42 }) });

    const expectedSetVoxelFailed$ = hot('(v|)', {
      v: setVoxelFailed(),
    });

    expect(effects.setVoxel$).toBeObservable(expectedSetVoxelFailed$);
  });

  it(`should dispatch 'voxelsSet' after 'setVoxels'`, () => {
    actions$ = hot('s', { s: setVoxels({ coords: [[0, 0, 0]], newValues: [42] }) });

    const expectedVoxelsSet$ = hot('v', {
      v: voxelsSet({ voxelChanges: [VOXEL_CHANGE] }),
    });

    expect(effects.setVoxels$).toBeObservable(expectedVoxelsSet$);
  });

  it(`should dispatch 'setVoxelFailed' after 'setVoxels'`, () => {
    spyOn(gridService, 'setVoxels').and.throwError('');
    actions$ = hot('s', { s: setVoxels({ coords: [[0, 0, 0]], newValues: [] }) });

    const expectedSetVoxelsFailed$ = hot('(s|)', {
      s: setVoxelsFailed(),
    });

    expect(effects.setVoxels$).toBeObservable(expectedSetVoxelsFailed$);
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
      a: addFirstLineChange(VOXEL_CHANGE),
    });

    expect(effects.startLine$).toBeObservable(expectedStartLine$);
  });

  it('should filter out duplicate origins', () => {
    spyOn(gridService, 'computeInternalNode1Mesh');

    const voxelChanges: VoxelChange[] = [
      { affectedNodeOrigin: [0, 0, 0], newValue: 1, oldValue: 1, xyz: [0, 0, 1] },
      { affectedNodeOrigin: [0, 0, 0], newValue: 1, oldValue: 1, xyz: [0, 0, 1] },
      { affectedNodeOrigin: [8, 0, 0], newValue: 1, oldValue: 1, xyz: [8, 0, 0] },
      { affectedNodeOrigin: [8, 0, 0], newValue: 1, oldValue: 1, xyz: [8, 0, 0] },
    ];

    actions$ = hot('-a', { a: voxelsSet({ voxelChanges }) });

    expect(effects.updateGridMeshMultiple$).toBeObservable(actions$);

    expect(gridService.computeInternalNode1Mesh).toHaveBeenCalledTimes(2);
    expect(gridService.computeInternalNode1Mesh).toHaveBeenCalledWith([0, 0, 0]);
    expect(gridService.computeInternalNode1Mesh).toHaveBeenCalledWith([8, 0, 0]);
  });
});
