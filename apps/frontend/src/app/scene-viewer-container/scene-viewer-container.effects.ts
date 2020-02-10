import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { UiSceneViewerService } from '@talus/ui';
import { areEqual, Coord } from '@talus/vdb';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import { GridService, VoxelChange } from './grid.service';
import {
  addFirstLineChange,
  finishLine,
  paintVoxel,
  paintVoxelFailed,
  removeVoxel,
  removeVoxelFailed,
  setLineChanges,
  setLineCoord,
  setVoxel,
  setVoxelFailed,
  setVoxels,
  setVoxelsFailed,
  startLine,
  voxelPainted,
  voxelRemoved,
  voxelSet,
  voxelsSet,
  voxelUnderCursorChange,
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

  setLineCord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setLineCoord),
      withLatestFrom(this.store.pipe(select(fromApp.selectSceneViewerContainerState))),
      map(([action, state]) =>
        state.selectedLineStartCoord
          ? finishLine({ voxelChanges: state.selectedLineChanges })
          : startLine(action),
      ),
    ),
  );

  startLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startLine),
      map(({ xyz, newValue }) => this.gridService.setVoxel(xyz, newValue)),
      map(voxelChange => addFirstLineChange(voxelChange)),
    ),
  );

  voxelUnderCursorChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(voxelUnderCursorChange),
      withLatestFrom(this.store.pipe(select(fromApp.selectSceneViewerContainerState))),
      filter(([action, state]) => {
        const lastLineChange = state.selectedLineChanges[state.selectedLineChanges.length - 1];

        return lastLineChange && !areEqual(lastLineChange.xyz, action.underPointerPosition);
      }),
      map(([action, state]) => {
        // remove old line
        state.selectedLineChanges.map(change =>
          change.oldValue === this.gridService.background
            ? this.gridService.removeVoxel(change.xyz)
            : this.gridService.setVoxel(change.xyz, change.oldValue),
        );

        return { action, state };
      }),
      map(({ action, state }) => {
        // Determine line end voxel
        // Check if pointer is over an already selected voxel of the line.
        // If so, use this as the endpoint instead, i.e. shorten line.
        // Start from the last added/most recent change, since pointer is most likely over
        // a voxel at the end of the line.
        let alreadySelectedIndex = -1;
        for (let i = state.selectedLineChanges.length - 1; i >= 0; i--) {
          if (areEqual(state.selectedLineChanges[i].xyz, action.underPointerPosition)) {
            alreadySelectedIndex = i;
            break;
          }
        }

        const endXyz =
          alreadySelectedIndex > -1
            ? state.selectedLineChanges[alreadySelectedIndex].xyz
            : action.toAddPosition;

        // add new line
        if (!state.selectedLineStartCoord) {
          return { removeChanges: state.selectedLineChanges, newChanges: [] };
        }

        const newChanges = this.gridService.selectLine(
          [state.selectedLineStartCoord, endXyz],
          action.color,
        );

        return { removeChanges: state.selectedLineChanges, newChanges };
      }),
      switchMap(({ removeChanges, newChanges }) => [
        setLineChanges({ voxelChanges: newChanges }),
        voxelsSet({ voxelChanges: [...removeChanges, ...newChanges] }),
      ]),
    ),
  );

  updateGridMesh$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelSet, voxelRemoved, voxelPainted, addFirstLineChange),
        tap(({ affectedNodeOrigin }) => this.computeAndUpdateNodeMesh(affectedNodeOrigin)),
      ),
    { dispatch: false },
  );

  updateGridMeshMultiple$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(voxelsSet),
        tap(({ voxelChanges }) =>
          this.getUniqueNodeOrigins(voxelChanges).map(origin => {
            this.computeAndUpdateNodeMesh(origin);
          }),
        ),
      ),
    { dispatch: false },
  );

  private getUniqueNodeOrigins(voxelChanges: VoxelChange[]): Coord[] {
    const origins = new Map<string, Coord>();
    voxelChanges.forEach(change => {
      origins.set(change.affectedNodeOrigin.toString(), change.affectedNodeOrigin);
    });

    return Array.from(origins.values());
  }

  private computeAndUpdateNodeMesh(affectedNodeOrigin: Coord): void {
    const mesh = this.gridService.computeInternalNode1Mesh(affectedNodeOrigin);
    this.sceneViewerService.updateNodeMesh(mesh, affectedNodeOrigin);
  }
}
