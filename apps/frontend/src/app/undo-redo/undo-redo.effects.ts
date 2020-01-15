import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import * as menuBarContainerActions from '../menu-bar-container/menu-bar-container.actions';
import { addVoxel, removeVoxel } from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, redo, redone, undo, undone } from './undo-redo.actions';

@Injectable()
export class UndoRedoEffects {
  constructor(private actions$: Actions, private store: Store<fromApp.State>) {}

  undo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undo, menuBarContainerActions.undo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentUndoAction))),
      switchMap(([action, currentUndoAction]) =>
        currentUndoAction ? [currentUndoAction, undone()] : [undone()],
      ),
    ),
  );

  redo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(redo, menuBarContainerActions.redo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentRedoAction))),
      switchMap(([action, currentRedoAction]) =>
        currentRedoAction ? [currentRedoAction, redone()] : [redone()],
      ),
    ),
  );

  userTriggeredActions$ = this.actions$.pipe(
    withLatestFrom(this.store.pipe(select(fromApp.selectUndoRedoState))),
    filter(([action, state]) => !state.isUndoRedoing),
    map(([action, state]) => action),
  );

  addUndoActionForAddVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(addVoxel),
      map(action => [action, removeVoxel({ position: action.position })]),
      map(this.createAddUndo),
    ),
  );

  addUndoActionForRemoveVoxel$ = createEffect(() =>
    this.userTriggeredActions$.pipe(
      ofType(removeVoxel),
      map(action => [action, addVoxel({ position: action.position, value: 42 })]),
      map(this.createAddUndo),
    ),
  );

  createAddUndo([redoAction, undoAction]: Action[]): Action {
    return addUndo({ redoAction, undoAction });
  }
}
