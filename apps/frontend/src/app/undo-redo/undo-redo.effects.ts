import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import {
  paintVoxel,
  removeVoxel,
  setVoxel,
  voxelPainted,
  voxelRemoved,
  voxelSet,
} from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, redo, redone, undo, undone } from './undo-redo.actions';

@Injectable()
export class UndoRedoEffects {
  constructor(private actions$: Actions, private store: Store<fromApp.State>) {}

  undo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undo, menuBarContainerActions.undo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentUndoStartAction))),
      switchMap(([_action, currentUndoAction]) =>
        currentUndoAction ? [currentUndoAction] : [undone()],
      ),
    ),
  );

  redo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(redo, menuBarContainerActions.redo),
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
        redoStartAction: setVoxel(voxelChange),
        redoEndActionType: voxelSet.type,
        undoStartAction: removeVoxel(voxelChange),
        undoEndActionType: voxelRemoved.type,
      })),
      map(addUndo),
    ),
  );

  addUndoActionForRemoveVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelRemoved),
      map(voxelChange => ({
        redoStartAction: removeVoxel(voxelChange),
        redoEndActionType: voxelRemoved.type,
        undoStartAction: setVoxel(voxelChange),
        undoEndActionType: voxelSet.type,
      })),
      map(addUndo),
    ),
  );

  addUndoActionForPaintVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelPainted),
      map(voxelChange => ({
        redoStartAction: paintVoxel(voxelChange),
        redoEndActionType: voxelPainted.type,
        undoStartAction: paintVoxel({ xyz: voxelChange.xyz, newValue: voxelChange.oldValue }),
        undoEndActionType: voxelPainted.type,
      })),
      map(addUndo),
    ),
  );
}
