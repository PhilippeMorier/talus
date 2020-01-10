import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import { addVoxel, removeVoxel } from '../scene-viewer-container/scene-viewer-container.actions';
import { addUndo, undo, undone } from './undo-redo.actions';

@Injectable()
export class UndoRedoEffects {
  constructor(private actions$: Actions, private store: Store<fromApp.State>) {}

  undo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undo),
      withLatestFrom(this.store.pipe(select(fromApp.selectNewestUndoAction))),
      switchMap(([action, newestUndoAction]) =>
        newestUndoAction ? [newestUndoAction, undone()] : [undone()],
      ),
    ),
  );

  addUndoActionForAddVoxel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addVoxel),
      map(action => removeVoxel({ position: action.position })),
      map(undoAction => addUndo({ undoAction })),
    ),
  );
}
