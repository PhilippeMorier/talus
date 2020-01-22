import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UiToolbarToolChange, UiToolbarToolConfig } from '@talus/ui';
import { Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Tool } from '../model/tool.value';
import { selectTool } from './tools-panel.actions';

@Component({
  selector: 'fe-tools-panel',
  template: `
    <ui-toolbar
      [tools]="tools"
      [selectedToolId]="selectedToolId$ | async"
      (toolChange)="onToolChange($event)"
    ></ui-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsPanelComponent {
  selectedToolId$: Observable<Tool>;

  tools: UiToolbarToolConfig<Tool>[] = [
    {
      icon: 'add_circle_outline',
      tooltip: '@@@ Set voxel',
      value: Tool.SetVoxel,
    },
    {
      icon: 'remove_circle_outline',
      tooltip: '@@@ Remove voxel',
      value: Tool.RemoveVoxel,
    },
    {
      icon: 'brush',
      tooltip: '@@@ Paint voxel',
      value: Tool.PaintVoxel,
    },
  ];

  constructor(private store: Store<fromApp.State>) {
    this.selectedToolId$ = store.pipe(select(fromApp.selectSelectedToolId));
  }

  onToolChange(event: UiToolbarToolChange<Tool>): void {
    this.store.dispatch(selectTool({ id: event.value }));
  }
}
