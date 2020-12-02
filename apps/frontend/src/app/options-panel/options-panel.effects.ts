import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { notNil } from '@talus/shared';
import { UiColorDialogService } from '@talus/ui';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { openColorDialog, openColorDialogFailed, selectColor } from './options-panel.actions';

@Injectable()
export class OptionsPanelEffects {
  constructor(private actions$: Actions, private colorDialogService: UiColorDialogService) {}

  openColorDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openColorDialog),
      map(({ colors, selectedColorIndex }) =>
        this.colorDialogService.open(colors, selectedColorIndex),
      ),
      mergeMap(dialogRef => dialogRef.beforeClosed()),
      notNil(),
      map(colorIndex => selectColor({ colorIndex })),
      catchError(() => of(openColorDialogFailed())),
    ),
  );
}
