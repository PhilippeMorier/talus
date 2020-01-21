import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UiColorDialogService } from '@talus/ui';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { openColorDialog, openColorDialogFailed } from './options-panel.actions';

@Injectable()
export class OptionsPanelEffects {
  constructor(private actions$: Actions, private colorDialogService: UiColorDialogService) {}

  openColorDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openColorDialog),
        map(({ colors, selectedColorIndex }) =>
          this.colorDialogService.open(colors, selectedColorIndex),
        ),
        catchError(() => of(openColorDialogFailed())),
      ),
    { dispatch: false },
  );
}
