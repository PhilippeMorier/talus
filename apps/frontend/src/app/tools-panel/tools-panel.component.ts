import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UiToolbarToolChange, UiToolbarToolConfig } from '@talus/ui';
import { Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Tool } from './tool.model';
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
      tooltip: '@@@ Add voxel',
      value: Tool.AddVoxel,
    },
    {
      icon: 'remove_circle_outline',
      tooltip: '@@@ Remove voxel',
      value: Tool.RemoveVoxel,
    },
  ];

  constructor(private store: Store<fromApp.State>) {
    this.selectedToolId$ = store.pipe(select(fromApp.selectSelectedToolId));
  }

  onToolChange(event: UiToolbarToolChange<Tool>): void {
    this.store.dispatch(selectTool({ id: event.value }));
  }
}