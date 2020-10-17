import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Nil } from '@talus/shared';

export type ToolValue = string | number;

export interface UiToolbarToolConfig<T extends ToolValue> {
  tooltip: string;
  icon: string;
  value: T;
}

export interface UiToolbarToolChange<T extends ToolValue> extends MatButtonToggleChange {
  value: T;
}

@Component({
  selector: ' ui-toolbar',
  template: `
    <mat-button-toggle-group vertical="true" [value]="selectedToolId" (change)="onChange($event)">
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
export class UiToolbarComponent {
  @Input() tools: UiToolbarToolConfig<ToolValue>[] = [];

  @Input() selectedToolId: ToolValue | Nil;

  @Output() toolChange = new EventEmitter<UiToolbarToolChange<ToolValue>>();

  onChange(event: UiToolbarToolChange<ToolValue>): void {
    this.toolChange.emit(event);
  }
}
