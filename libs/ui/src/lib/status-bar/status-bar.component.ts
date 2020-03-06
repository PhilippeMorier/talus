import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ui-status-bar',
  template: `
    <mat-toolbar>
      <span>{{ status }}</span>

      <span class="spacer"></span>
      <span>{{ progressValue }}</span>
      <span class="spacer"></span>

      <mat-icon *ngIf="connected" matTooltip="@@@ Connected">cloud_queue</mat-icon>
      <mat-icon *ngIf="!connected" matTooltip="@@@ Disconnected">cloud_off</mat-icon>
    </mat-toolbar>
  `,
  styleUrls: ['./status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStatusBarComponent {
  @Input() connected = false;
  @Input() status: string;
  @Input() progressValue: number;
}
