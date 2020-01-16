import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
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
      map(voxelChange => ({
        redoStartAction: addVoxel(voxelChange),
        redoEndActionType: voxelAdded.type,
        undoStartAction: removeVoxel({ position: voxelChange.position }),
        undoEndActionType: voxelRemoved.type,
      })),
      map(addUndo),
    ),
  );

  addUndoActionForRemoveVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(voxelRemoved),
      map(voxelChange => ({
        redoStartAction: removeVoxel({ position: voxelChange.position }),
        redoEndActionType: voxelRemoved.type,
        undoStartAction: addVoxel(voxelChange),
        undoEndActionType: voxelAdded.type,
      })),
      map(addUndo),
    ),
  );
}
