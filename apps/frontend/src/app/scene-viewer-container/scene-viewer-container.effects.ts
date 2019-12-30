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
      map(({ position, value }) => this.gridService.addVoxel(position, value)),
      map(affectedOrigin => voxelAdded({ affectedOrigins: [affectedOrigin] })),
      catchError(() => of(addVoxelFailed())),
    ),
  );

  addVoxels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVoxels),
      map(({ positions, values }) => this.gridService.addVoxels(positions, values)),
      map(affectedOrigins => voxelsAdded({ affectedOrigins })),
      catchError(() => of(addVoxelsFailed())),
    ),
  );

  removeVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeVoxel),
      map(({ position }) => this.gridService.removeVoxel(position)),
      map(affectedOrigin => voxelRemoved({ affectedOrigins: [affectedOrigin] })),
      catchError(() => of(removeVoxelFailed())),
    ),
  );

  updateGridMesh$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelAdded, voxelsAdded, voxelRemoved),
        tap({
          next: ({ affectedOrigins }) => {
            affectedOrigins.map(origin => {
              const mesh = this.gridService.computeInternalNode1Mesh(origin);
              this.sceneViewerService.updateGridMesh(mesh);
            });
          },
        }),
      ),
    { dispatch: false },
  );
}
