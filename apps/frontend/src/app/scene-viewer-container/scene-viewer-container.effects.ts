import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { UiSceneViewerService } from '@talus/ui';
import { Coord } from '@talus/vdb';
import { of } from 'rxjs';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import { GridService } from './grid.service';
import {
  paintVoxel,
  paintVoxelFailed,
  removeVoxel,
  removeVoxelFailed,
  selectLinePoint,
  setVoxel,
  setVoxelFailed,
  setVoxels,
  setVoxelsFailed,
  voxelPainted,
  voxelRemoved,
  voxelSet,
  voxelsSet,
} from './scene-viewer-container.actions';

@Injectable()
export class SceneViewerContainerEffects {
  constructor(
    private actions$: Actions,
    private gridService: GridService,
    private sceneViewerService: UiSceneViewerService,
    private store: Store<fromApp.State>,
  ) {}

  setVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setVoxel),
      map(({ xyz, newValue }) => this.gridService.setVoxel(xyz, newValue)),
      map(voxelSet),
      catchError(() => of(setVoxelFailed())),
    ),
  );

  setVoxels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setVoxels),
      map(({ coords, newValues }) => this.gridService.setVoxels(coords, newValues)),
      map(voxelChanges => voxelsSet({ voxelChanges })),
      catchError(() => of(setVoxelsFailed())),
    ),
  );

  removeVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeVoxel),
      map(({ xyz }) => this.gridService.removeVoxel(xyz)),
      map(voxelRemoved),
      catchError(() => of(removeVoxelFailed())),
    ),
  );

  paintVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paintVoxel),
      map(({ xyz, newValue }) => this.gridService.paintVoxel(xyz, newValue)),
      map(voxelPainted),
      catchError(() => of(paintVoxelFailed())),
    ),
  );

  selectLinePoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectLinePoint),
      withLatestFrom(this.store.pipe(select(fromApp.selectSceneViewerContainerState))),
      map(([action, state]) =>
        !state.selectingPoints
          ? this.gridService.selectLine(state.selectedPoints, action.newValue)
          : [],
      ),
      map(voxelChanges => voxelsSet({ voxelChanges })),
    ),
  );

  updateGridMesh$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelSet, voxelRemoved, voxelPainted),
        map(({ affectedNodeOrigin }) => this.computeAndUpdateNodeMesh(affectedNodeOrigin)),
      ),
    { dispatch: false },
  );

  updateGridMeshMultiple$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelsSet),
        map(({ voxelChanges }) =>
          voxelChanges.map(change => {
            this.computeAndUpdateNodeMesh(change.affectedNodeOrigin);
          }),
        ),
      ),
    { dispatch: false },
  );

  private computeAndUpdateNodeMesh(affectedNodeOrigin: Coord): void {
    const mesh = this.gridService.computeInternalNode1Mesh(affectedNodeOrigin);
    this.sceneViewerService.updateNodeMesh(mesh, affectedNodeOrigin);
  }
}
