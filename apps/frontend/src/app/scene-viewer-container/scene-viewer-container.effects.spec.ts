import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Topic } from '@talus/model';
import { UiSceneViewerService, UiTopicDialogService } from '@talus/ui';
import { hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import * as fromApp from '../app.reducer';
import { openTopicDialog, selectTopic } from '../menu-bar-container/menu-bar-container.actions';
import { initialMockState } from '../testing';
import { KafkaProxyService } from '../web-socket/kafka-proxy.service';
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
  affectedNodeOrigin: { x: 0, y: 0, z: 0 },
  newValue: 42,
  oldValue: -1,
  xyz: { x: 0, y: 0, z: 0 },
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

@Injectable()
class UiTopicDialogServiceMock {
  open(): void {
    return;
  }
}

@Injectable()
class KafkaProxyServiceMock {
  createTopic(): void {
    return;
  }
  setTopic(): void {
    return;
  }
}

describe('SceneViewerContainerEffects', () => {
  let actions$: Observable<Action>;
  let effects: SceneViewerContainerEffects;
  let gridService: GridService;
  let topicService: UiTopicDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: GridService, useClass: GridServiceMock },
        { provide: UiSceneViewerService, useClass: UiSceneViewerServiceMock },
        { provide: UiTopicDialogService, useClass: UiTopicDialogServiceMock },
        { provide: KafkaProxyService, useClass: KafkaProxyServiceMock },
        SceneViewerContainerEffects,
        provideMockActions(() => actions$),
        provideMockStore<fromApp.State>({
          initialState: initialMockState,
        }),
      ],
    });

    effects = TestBed.inject(SceneViewerContainerEffects);
    gridService = TestBed.inject(GridService);
    topicService = TestBed.inject(UiTopicDialogService);
  });

  it(`should dispatch 'voxelSet' after 'setVoxel'`, () => {
    actions$ = hot('s', { s: setVoxel({ xyz: { x: 0, y: 0, z: 0 }, newValue: 42 }) });

    const expectedVoxelSet$ = hot('v', {
      v: voxelSet(VOXEL_CHANGE),
    });

    expect(effects.setVoxel$).toBeObservable(expectedVoxelSet$);
  });

  it(`should dispatch 'setVoxelFailed' after 'setVoxel'`, () => {
    spyOn(gridService, 'setVoxel').and.throwError('');
    actions$ = hot('s', { s: setVoxel({ xyz: { x: 0, y: 0, z: 0 }, newValue: 42 }) });

    const expectedSetVoxelFailed$ = hot('(v|)', {
      v: setVoxelFailed(),
    });

    expect(effects.setVoxel$).toBeObservable(expectedSetVoxelFailed$);
  });

  it(`should dispatch 'voxelsSet' after 'setVoxels'`, () => {
    actions$ = hot('s', { s: setVoxels({ coords: [{ x: 0, y: 0, z: 0 }], newValues: [42] }) });

    const expectedVoxelsSet$ = hot('v', {
      v: voxelsSet({ voxelChanges: [VOXEL_CHANGE] }),
    });

    expect(effects.setVoxels$).toBeObservable(expectedVoxelsSet$);
  });

  it(`should dispatch 'setVoxelFailed' after 'setVoxels'`, () => {
    spyOn(gridService, 'setVoxels').and.throwError('');
    actions$ = hot('s', { s: setVoxels({ coords: [{ x: 0, y: 0, z: 0 }], newValues: [] }) });

    const expectedSetVoxelsFailed$ = hot('(s|)', {
      s: setVoxelsFailed(),
    });

    expect(effects.setVoxels$).toBeObservable(expectedSetVoxelsFailed$);
  });

  it(`should dispatch 'startLine' after 'setLineCoord'`, () => {
    actions$ = hot('a', { a: setLineCoord({ xyz: { x: 0, y: 0, z: 0 }, newValue: 42 }) });

    const expectedStartLine$ = hot('s', {
      s: startLine({ xyz: { x: 0, y: 0, z: 0 }, newValue: 42 }),
    });

    expect(effects.setLineCord$).toBeObservable(expectedStartLine$);
  });

  it(`should dispatch 'addFirstLineChange' after 'startLine'`, () => {
    actions$ = hot('a', { a: startLine({ xyz: { x: 0, y: 0, z: 0 }, newValue: 42 }) });

    const expectedStartLine$ = hot('a', {
      a: addFirstLineChange(VOXEL_CHANGE),
    });

    expect(effects.startLine$).toBeObservable(expectedStartLine$);
  });

  it('should filter out duplicate origins', () => {
    spyOn(gridService, 'computeInternalNode1Mesh');

    const voxelChanges: VoxelChange[] = [
      {
        affectedNodeOrigin: { x: 0, y: 0, z: 0 },
        newValue: 1,
        oldValue: 1,
        xyz: { x: 0, y: 0, z: 1 },
      },
      {
        affectedNodeOrigin: { x: 0, y: 0, z: 0 },
        newValue: 1,
        oldValue: 1,
        xyz: { x: 0, y: 0, z: 1 },
      },
      {
        affectedNodeOrigin: { x: 8, y: 0, z: 0 },
        newValue: 1,
        oldValue: 1,
        xyz: { x: 8, y: 0, z: 0 },
      },
      {
        affectedNodeOrigin: { x: 8, y: 0, z: 0 },
        newValue: 1,
        oldValue: 1,
        xyz: { x: 8, y: 0, z: 0 },
      },
    ];

    actions$ = hot('-a', { a: voxelsSet({ voxelChanges }) });

    expect(effects.updateGridMeshMultiple$).toBeObservable(actions$);

    expect(gridService.computeInternalNode1Mesh).toHaveBeenCalledTimes(2);
    expect(gridService.computeInternalNode1Mesh).toHaveBeenCalledWith({ x: 0, y: 0, z: 0 });
    expect(gridService.computeInternalNode1Mesh).toHaveBeenCalledWith({ x: 8, y: 0, z: 0 });
  });

  it(`should dispatch 'selectSession' after 'openSessionDialog'`, () => {
    const topics: Topic[] = [
      { name: 'topic-1', offsets: [] },
      { name: 'topic-2', offsets: [] },
    ];
    actions$ = hot('o', { o: openTopicDialog({ topics }) });

    spyOn(topicService, 'open').and.returnValue({
      beforeClosed: () => of({ topicName: topics[0].name, isNewTopic: false }),
    });
    const expected$ = hot('s', { s: selectTopic({ topic: topics[0].name, isNewTopic: false }) });

    expect(effects.openTopicDialog$).toBeObservable(expected$);
    expect(topicService.open).toHaveBeenCalledTimes(1);
  });
});
