import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import { addVoxel, removeVoxel } from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, redo, redone, undo, undone } from './undo-redo.actions';

@Injectable()
export class UndoRedoEffects {
  constructor(private actions$: Actions, private store: Store<fromApp.State>) {}

  undo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undo),
      withLatestFrom(this.store.pipe(select(fromApp.selectCurrentUndoAction))),
      switchMap(([action, currentUndoAction]) =>
        currentUndoAction ? [currentUndoAction, undone()] : [undone()],
      ),
    ),
  );

  redo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(redo),
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
      map(([redoAction, undoAction]) => addUndo({ redoAction, undoAction })),
    ),
  );
}
