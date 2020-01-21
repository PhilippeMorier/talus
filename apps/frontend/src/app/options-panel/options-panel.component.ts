import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiColorDialogColor, UiColorDialogService } from '@talus/ui';

@Component({
  selector: 'fe-options-panel',
  template: `
    <button mat-icon-button (click)="onClick()">
      <mat-icon>color_lens</mat-icon>
      <mat-icon id="more-caret-icon">signal_cellular_4_bar</mat-icon>
      <mat-icon id="color-icon">fiber_manual_record</mat-icon>
    </button>
  `,
  styleUrls: ['./options-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsPanelComponent {
  readonly colors: UiColorDialogColor[] = [
    {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    },
    {
      r: 0,
      g: 0,
      b: 255,
      a: 1,
    },
    {
      r: 0,
      g: 255,
      b: 0,
      a: 1,
    },
    {
      r: 0,
      g: 255,
      b: 255,
      a: 1,
    },
    {
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    },
  ];

  constructor(public colorDialogService: UiColorDialogService) {}

  onClick(): void {
    this.colorDialogService.open(this.colors);
  }
}
