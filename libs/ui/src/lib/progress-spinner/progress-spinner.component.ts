import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Nil } from '@talus/shared';

@Component({
  selector: 'ui-progress-spinner',
  template: `
    <mat-progress-spinner
      class="example-margin"
      [color]="color"
      [mode]="mode"
      [value]="value"
    ></mat-progress-spinner>

    <h2 *ngIf="value" class="value">{{ value }}%</h2>

    <div *ngIf="status">{{ status }}</div>
  `,
  styleUrls: ['./progress-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProgressSpinnerComponent {
  @Input() value: number | Nil;
  @Input() status: string | Nil;
  @Input() mode: 'determinate' | 'indeterminate' = 'determinate';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}
