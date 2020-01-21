import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { UiMenuBarMenu } from '@talus/ui';
import * as fromApp from '../app.reducer';
import { redo, undo } from './menu-bar-container.actions';

@Component({
  selector: 'fe-menu-bar-container',
  template: `
    <ui-menu-bar (menuItemClick)="onMenuItemClick($event)" [menus]="menus"></ui-menu-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBarContainerComponent {
  menus: UiMenuBarMenu<Action>[] = [
    {
      label: 'Edit',
      menuItems: [
        {
          icon: 'undo',
          label: 'Undo',
          value: undo(),
        },
        {
          icon: 'redo',
          label: 'Redo',
          value: redo(),
        },
      ],
    },
  ];

  constructor(private store: Store<fromApp.State>) {}

  onMenuItemClick(action: Action): void {
    this.store.dispatch(action);
  }
}
