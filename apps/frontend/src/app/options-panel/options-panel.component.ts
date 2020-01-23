import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UiColorDialogColor } from '@talus/ui';
import { combineLatest, Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Rgba } from '../model/rgba.value';
import { openColorDialog } from './options-panel.actions';

@Component({
  selector: 'fe-options-panel',
  template: `
    <button
      mat-icon-button
      *ngIf="cssColorsAndSelectedColorIndex$ | async as selected"
      (click)="onClick(selected[0], selected[1])"
    >
      <mat-icon>color_lens</mat-icon>
      <mat-icon id="more-caret-icon">signal_cellular_4_bar</mat-icon>
      <mat-icon id="color-icon" [style.color]="getCssRgbaString(selectedCssColor$ | async)">
        fiber_manual_record
      </mat-icon>
    </button>
  `,
  styleUrls: ['./options-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsPanelComponent {
  private cssColors$: Observable<Rgba[]> = this.store.pipe(select(fromApp.selectCssColors));

  private selectedColorIndex$: Observable<number> = this.store.pipe(
    select(fromApp.selectSelectedColorIndex),
  );

  selectedCssColor$: Observable<UiColorDialogColor> = this.store.pipe(
    select(fromApp.selectSelectedCssColor),
  );

  cssColorsAndSelectedColorIndex$ = combineLatest([this.cssColors$, this.selectedColorIndex$]);

  constructor(public store: Store<fromApp.State>) {}

  onClick(colors: UiColorDialogColor[], selectedColorIndex: number): void {
    this.store.dispatch(openColorDialog({ colors, selectedColorIndex }));
  }

  getCssRgbaString(color: Rgba): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
}
