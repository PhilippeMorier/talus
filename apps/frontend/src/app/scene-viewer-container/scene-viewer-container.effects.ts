import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SceneViewerService } from '@talus/ui';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GridService } from './grid.service';
import {
  addVoxel,
  addVoxelFailed,
  removeVoxel,
  removeVoxelFailed,
  voxelAdded,
  voxelRemoved,
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
          this.sceneViewerService.updateGridMesh(this.gridService.computeMesh());
        },
      }),
      map(() => voxelAdded()),
      catchError(() => of(addVoxelFailed())),
    ),
  );

  removeVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeVoxel),
      tap({
        next: ({ position }) => {
          this.gridService.removeVoxel(position);
          this.sceneViewerService.updateGridMesh(this.gridService.computeMesh());
        },
      }),
      map(() => voxelRemoved()),
      catchError(() => of(removeVoxelFailed())),
    ),
  );
}
