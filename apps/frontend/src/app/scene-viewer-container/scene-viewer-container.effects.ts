import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SceneViewerService } from '@talus/ui';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
    private sceneViewerService: SceneViewerService,
  ) {}

  addVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVoxel),
      tap({
        next: ({ position, value }) => {
          this.gridService.addVoxel(position, value);
        },
      }),
      map(() => voxelAdded()),
      catchError(() => of(addVoxelFailed())),
    ),
  );

  addVoxels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVoxels),
      tap({
        next: ({ positions, values }) => {
          this.gridService.addVoxels(positions, values);
        },
      }),
      map(() => voxelsAdded()),
      catchError(() => of(addVoxelsFailed())),
    ),
  );

  removeVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeVoxel),
      tap({
        next: ({ position }) => {
          this.gridService.removeVoxel(position);
        },
      }),
      map(() => voxelRemoved()),
      catchError(() => of(removeVoxelFailed())),
    ),
  );

  updateGridMesh$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelAdded, voxelsAdded, removeVoxel),
        tap({
          next: () => {
            this.sceneViewerService.updateGridMesh(this.gridService.computeMesh());
          },
        }),
      ),
    { dispatch: false },
  );
}
