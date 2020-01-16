import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UiSceneViewerService } from '@talus/ui';
import { Coord } from '@talus/vdb';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GridService } from './grid.service';
import {
  addVoxel,
  addVoxelFailed,
  addVoxels,
  addVoxelsFailed,
  removeVoxel,
  removeVoxelFailed,
  voxelAdded,
  voxelRemoved,
  voxelsAdded,
} from './scene-viewer-container.actions';

@Injectable()
export class SceneViewerContainerEffects {
  constructor(
    private actions$: Actions,
    private gridService: GridService,
    private sceneViewerService: UiSceneViewerService,
  ) {}

  addVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVoxel),
      map(({ position, value }) => this.gridService.addVoxel(position, value)),
      map(voxelAdded),
      catchError(() => of(addVoxelFailed())),
    ),
  );

  addVoxels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVoxels),
      map(({ positions, values }) => this.gridService.addVoxels(positions, values)),
      map(voxelChanges => voxelsAdded({ voxelChanges })),
      catchError(() => of(addVoxelsFailed())),
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

  updateGridMesh$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelAdded, voxelRemoved),
        map(({ affectedNodeOrigin }) => this.computeAndUpdateNodeMesh(affectedNodeOrigin)),
      ),
    { dispatch: false },
  );

  updateGridMeshMultiple$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelsAdded),
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
