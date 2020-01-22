import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UiColorDialogColor } from '@talus/ui';
import { combineLatest, Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { openColorDialog } from './options-panel.actions';

@Component({
  selector: 'fe-options-panel',
  template: `
    <button
      mat-icon-button
      *ngIf="selectedColorAndIndex$ | async as selected"
      (click)="onClick(selected[0], selected[1])"
    >
      <mat-icon>color_lens</mat-icon>
      <mat-icon id="more-caret-icon">signal_cellular_4_bar</mat-icon>
      <mat-icon id="color-icon" [style.color]="getRgbaString(selectedColor$ | async)">
        fiber_manual_record
      </mat-icon>
    </button>
  `,
  styleUrls: ['./options-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsPanelComponent {
  selectedColor$: Observable<UiColorDialogColor> = this.store.pipe(
    select(fromApp.selectSelectedColor),
  );

  private colors$: Observable<UiColorDialogColor[]> = this.store.pipe(select(fromApp.selectColors));

  private selectedColorIndex$: Observable<number> = this.store.pipe(
    select(fromApp.selectSelectedColorIndex),
  );

  selectedColorAndIndex$ = combineLatest([this.colors$, this.selectedColorIndex$]);

  constructor(public store: Store<fromApp.State>) {}

  onClick(colors: UiColorDialogColor[], selectedColorIndex: number): void {
    this.store.dispatch(openColorDialog({ colors, selectedColorIndex }));
  }

  getRgbaString(color: UiColorDialogColor): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a} )`;
  }
}
