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
      map(path => voxelAdded({ affectedOrigins: path.internalNode1Origins })),
      catchError(() => of(addVoxelFailed())),
    ),
  );

  addVoxels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVoxels),
      map(({ positions, values }) => this.gridService.addVoxels(positions, values)),
      map(path => voxelsAdded({ affectedOrigins: path.internalNode1Origins })),
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
        ofType(voxelAdded, voxelsAdded /*, removeVoxel*/),
        tap({
          next: ({ affectedOrigins }) => {
            affectedOrigins.map(origin => {
              const mesh = this.gridService.computeInternalNode1Mesh(origin);
              this.sceneViewerService.updateGridMesh(mesh);
            });

            // this.sceneViewerService.updateGridMesh(
            //   this.gridService.computeLastAccessedLeafNodeMesh(),
            // );
          },
        }),
      ),
    { dispatch: false },
  );
}
