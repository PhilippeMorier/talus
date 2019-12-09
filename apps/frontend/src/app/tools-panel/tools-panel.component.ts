import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiToolbarToolChange, UiToolbarToolConfig } from '@talus/ui';
import { Tool } from './tool.model';
import { selectTool } from './tools-panel.actions';
import { State } from './tools-panel.reducer';

@Component({
  selector: 'fe-tools-panel',
  template: `
    <ui-toolbar [tools]="tools" (toolChange)="onToolChange($event)"></ui-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsPanelComponent {
  tools: UiToolbarToolConfig<Tool>[] = [
    {
      icon: 'add_circle_outline',
      tooltip: '@@@ Add voxel',
      value: Tool.AddVoxel,
    },
    {
      icon: 'remove_circle_outline',
      tooltip: '@@@ Remove voxel',
      value: Tool.RemoveVoxel,
    },
  ];

  constructor(private store: Store<State>) {}

  onToolChange(event: UiToolbarToolChange<Tool>): void {
    this.store.dispatch(selectTool({ id: event.value }));
  }
}
