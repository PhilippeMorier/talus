import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import {
  finishLine,
  paintVoxel,
  removeVoxel,
  setVoxel,
  setVoxels,
  voxelPainted,
  voxelRemoved,
  voxelSet,
  voxelsSet,
} from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, redone, undone } from './undo-redo.actions';

@Injectable()
export class UndoRedoEffects {
  constructor(private actions$: Actions, private store: Store<fromApp.State>) {}

  undo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(menuBarContainerActions.undo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentUndoStartAction))),
      switchMap(([_action, currentUndoAction]) =>
        currentUndoAction ? [currentUndoAction] : [undone()],
      ),
    ),
  );

  redo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(menuBarContainerActions.redo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentRedoStartAction))),
      switchMap(([_action, currentRedoAction]) =>
        currentRedoAction ? [currentRedoAction] : [redone()],
      ),
    ),
  );

  undoTriggeredActions$ = this.actions$.pipe(
    withLatestFrom(this.store.pipe(select(fromApp.selectUndoRedoState))),
    filter(([_action, state]) => state.isUndoing),
    map(([action, _state]) => action),
  );

  undone$ = createEffect(() =>
    this.undoTriggeredActions$.pipe(
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentUndoEndAction))),
      filter(([action, undoEndAction]) => action.type === undoEndAction),
      map(() => undone()),
    ),
  );

  redoTriggeredActions$ = this.actions$.pipe(
    withLatestFrom(this.store.pipe(select(fromApp.selectUndoRedoState))),
    filter(([_action, state]) => state.isRedoing),
    map(([action, _state]) => action),
  );

  redone$ = createEffect(() =>
    this.redoTriggeredActions$.pipe(
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentRedoEndAction))),
      filter(([action, redoEndAction]) => action.type === redoEndAction),
      map(() => redone()),
    ),
  );

  userTriggeredActions$ = this.actions$.pipe(
    withLatestFrom(this.store.pipe(select(fromApp.selectUndoRedoState))),
    filter(([_action, state]) => !state.isUndoing && !state.isRedoing),
    map(([action, _state]) => action),
  );

  addUndoActionForSetVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelSet),
      map(voxelChange => ({
        redoStartAction: setVoxel({ ...voxelChange, needsSync: true }),
        redoEndActionType: voxelSet.type,
        undoStartAction: removeVoxel({ ...voxelChange, needsSync: true }),
        undoEndActionType: voxelRemoved.type,
      })),
      map(addUndo),
    ),
  );

  addUndoActionForRemoveVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelRemoved),
      map(voxelChange => ({
        redoStartAction: removeVoxel({ ...voxelChange, needsSync: true }),
        redoEndActionType: voxelRemoved.type,
        undoStartAction: setVoxel({ ...voxelChange, needsSync: true }),
        undoEndActionType: voxelSet.type,
      })),
      map(addUndo),
    ),
  );

  addUndoActionForPaintVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelPainted),
      map(voxelChange => ({
        redoStartAction: paintVoxel({ ...voxelChange, needsSync: true }),
        redoEndActionType: voxelPainted.type,
        undoStartAction: paintVoxel({
          xyz: voxelChange.xyz,
          newValue: voxelChange.oldValue,
          needsSync: true,
        }),
        undoEndActionType: voxelPainted.type,
      })),
      map(addUndo),
    ),
  );

  addUndoActionForFinishLine$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(finishLine),
      map(({ voxelChanges }) => {
        const coords = voxelChanges.map(c => c.xyz);
        const newValues = voxelChanges.map(c => c.newValue);
        const oldValues = voxelChanges.map(c => c.oldValue);

        return {
          redoStartAction: setVoxels({ coords, newValues, needsSync: true }),
          redoEndActionType: voxelsSet.type,
          undoStartAction: setVoxels({ coords, newValues: oldValues, needsSync: true }),
          undoEndActionType: setVoxels.type,
        };
      }),
      map(addUndo),
    ),
  );
}
