import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import {
  addVoxel,
  removeVoxel,
  voxelAdded,
  voxelRemoved,
} from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, redo, redone, undo, undone } from './undo-redo.actions';

@Injectable()
export class UndoRedoEffects {
  constructor(private actions$: Actions, private store: Store<fromApp.State>) {}

  undo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undo, menuBarContainerActions.undo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentUndoStartAction))),
      switchMap(([action, currentUndoAction]) =>
        currentUndoAction ? [currentUndoAction] : [undone()],
      ),
    ),
  );

  redo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(redo, menuBarContainerActions.redo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentRedoStartAction))),
      switchMap(([action, currentRedoAction]) =>
        currentRedoAction ? [currentRedoAction] : [redone()],
      ),
    ),
  );

  undoTriggeredActions$ = this.actions$.pipe(
    withLatestFrom(this.store.pipe(select(fromApp.selectUndoRedoState))),
    filter(([action, state]) => state.isUndoing),
    map(([action, state]) => action),
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
    filter(([action, state]) => state.isRedoing),
    map(([action, state]) => action),
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
    filter(([action, state]) => !state.isUndoing && !state.isRedoing),
    map(([action, state]) => action),
  );

  addUndoActionForAddVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelAdded),
      map(action => ({
        redoStartAction: addVoxel({
          position: action.voxelChange.position,
          value: action.voxelChange.value,
        }),
        redoEndAction: voxelAdded.type,
        undoStartAction: removeVoxel({
          position: action.voxelChange.position,
        }),
        undoEndActionType: voxelRemoved.type,
      })),
      map(({ redoStartAction, redoEndAction, undoStartAction, undoEndActionType }) =>
        this.createAddUndo(redoStartAction, redoEndAction, undoStartAction, undoEndActionType),
      ),
    ),
  );

  addUndoActionForRemoveVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelRemoved),
      map(action => ({
        redoStartAction: removeVoxel({ position: action.voxelChange.position }),
        redoEndAction: voxelRemoved.type,
        undoStartAction: addVoxel({
          position: action.voxelChange.position,
          value: action.voxelChange.value,
        }),
        undoEndActionType: voxelAdded.type,
      })),
      map(({ redoStartAction, redoEndAction, undoStartAction, undoEndActionType }) =>
        this.createAddUndo(redoStartAction, redoEndAction, undoStartAction, undoEndActionType),
      ),
    ),
  );

  createAddUndo(
    redoStartAction: Action,
    redoEndActionType: string,
    undoStartAction: Action,
    undoEndActionType: string,
  ): Action {
    return addUndo({ redoStartAction, redoEndActionType, undoStartAction, undoEndActionType });
  }
}
