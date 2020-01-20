import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UiSceneViewerService } from '@talus/ui';
import { Coord } from '@talus/vdb';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GridService } from './grid.service';
import {
  setVoxel,
  setVoxelFailed,
  setVoxels,
  setVoxelsFailed,
  paintVoxel,
  paintVoxelFailed,
  removeVoxel,
  removeVoxelFailed,
  voxelSet,
  voxelPainted,
  voxelRemoved,
  voxelsSet,
} from './scene-viewer-container.actions';

@Injectable()
export class SceneViewerContainerEffects {
  constructor(
    private actions$: Actions,
    private gridService: GridService,
    private sceneViewerService: UiSceneViewerService,
  ) {}

  setVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setVoxel),
      map(({ position, value }) => this.gridService.setVoxel(position, value)),
      map(voxelSet),
      catchError(() => of(setVoxelFailed())),
    ),
  );

  setVoxels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setVoxels),
      map(({ positions, values }) => this.gridService.setVoxels(positions, values)),
      map(voxelChanges => voxelsSet({ voxelChanges })),
      catchError(() => of(setVoxelsFailed())),
    ),
  );

  removeVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeVoxel),
      map(({ position }) => this.gridService.removeVoxel(position)),
      map(voxelRemoved),
      catchError(() => of(removeVoxelFailed())),
    ),
  );

  paintVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(paintVoxel),
      map(({ position }) => this.gridService.paintVoxel(position)),
      map(voxelPainted),
      catchError(() => of(paintVoxelFailed())),
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
