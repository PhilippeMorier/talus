import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material';

export interface UiToolbarToolConfig<T> {
  tooltip?: string;
  icon: string;
  value: T;
}

export interface UiToolbarToolChange<T> extends MatButtonToggleChange {
  value: T;
}

@Component({
  selector: ' ui-toolbar',
  template: `
    <mat-button-toggle-group vertical="true" (change)="onChange($event)">
      <mat-button-toggle
        *ngFor="let tool of tools"
        matTooltipPosition="right"
        [aria-label]="tool.tooltip"
        [matTooltip]="tool.tooltip"
        [value]="tool.value"
      >
        <mat-icon>{{ tool.icon }}</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input() tools: UiToolbarToolConfig<any>[];

  @Output() toolChange = new EventEmitter<UiToolbarToolChange<any>>();

  onChange(event: UiToolbarToolChange<any>): void {
    this.toolChange.emit(event);
  }
}
