import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import { GridService } from '../scene-viewer-container/grid.service';
import { cancelLine, voxelsSet } from '../scene-viewer-container/scene-viewer-container.actions';
import { removeSelectionLinePreview, selectTool } from './tools-panel.actions';

@Injectable()
export class ToolsPanelEffects {
  constructor(
    private actions$: Actions,
    private gridService: GridService,
    private store: Store<fromApp.State>,
  ) {}

  selectTool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectTool),
      withLatestFrom(this.store.pipe(select(fromApp.selectSceneViewerContainerState))),
      filter(([_action, state]) => Boolean(state.selectedLineStartCoord)),
      map(() => removeSelectionLinePreview()),
    ),
  );

  removeSelectionLinePreview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeSelectionLinePreview),
      withLatestFrom(this.store.pipe(select(fromApp.selectSceneViewerContainerState))),
      map(([_action, state]) =>
        state.selectedLineChanges.map(change =>
          this.gridService.setVoxel(change.xyz, change.oldValue),
        ),
      ),
      switchMap(voxelChanges => [voxelsSet({ voxelChanges }), cancelLine()]),
    ),
  );
}
