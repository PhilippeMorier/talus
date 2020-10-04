import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Tool } from '@talus/model';
import { ToolValue, UiToolbarToolChange, UiToolbarToolConfig } from '@talus/ui';
import { Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
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
      icon: 'timeline',
      tooltip: '@@@ Select line point',
      value: Tool.SelectLinePoint,
    },
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

  onToolChange(event: UiToolbarToolChange<ToolValue>): void {
    // https://stackoverflow.com/questions/17380845/how-do-i-convert-a-string-to-enum-in-typescript#comment98790295_17381004
    const tool: Tool | undefined = Tool[event.value as keyof typeof Tool];

    if (tool) {
      this.store.dispatch(selectTool({ id: tool }));
    }
  }
}
