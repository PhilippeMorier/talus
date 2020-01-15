import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { UiMenuBarConfig } from '@talus/ui';
import * as fromApp from '../app.reducer';
import { redo, undo } from './menu-bar-container.actions';

@Component({
  selector: 'fe-menu-bar-container',
  template: `
    <ui-menu-bar (menuItemClick)="onMenuItemClick($event)" [menuConfig]="menuConfig"></ui-menu-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBarContainerComponent {
  menuConfig: UiMenuBarConfig<Action> = {
    menus: [
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
    ],
  };

  constructor(private store: Store<fromApp.State>) {}

  onMenuItemClick(action: Action): void {
    this.store.dispatch(action);
  }
}
