import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { UiMenuBarMenu } from '@talus/ui';
import { map } from 'rxjs/operators';
import * as fromApp from '../app.reducer';
import {
  openTopicDialog,
  redo,
  setDarkTheme,
  setLightTheme,
  undo,
} from './menu-bar-container.actions';

@Component({
  selector: 'fe-menu-bar-container',
  template: `
    <ui-menu-bar (menuItemClick)="onMenuItemClick($event)" [menus]="menus$ | async"></ui-menu-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBarContainerComponent {
  private readonly menus: UiMenuBarMenu<Action>[] = [
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

  menus$ = this.store.pipe(
    select(fromApp.selectSceneViewerContainerState),
    map(state => [
      {
        label: 'File',
        menuItems: [
          {
            icon: 'note_add',
            label: 'Open/New',
            value: openTopicDialog({ topics: state.topics }),
          },
        ],
      },
      ...this.menus,
      {
        label: 'View',
        menuItems: [
          ...(state.isDarkTheme
            ? [
                {
                  icon: 'brightness_5',
                  label: 'Light',
                  value: setLightTheme(),
                },
              ]
            : [
                {
                  icon: 'brightness_2',
                  label: 'Dark',
                  value: setDarkTheme(),
                },
              ]),
        ],
      },
    ]),
  );

  constructor(private store: Store<fromApp.State>) {}

  onMenuItemClick(action: Action): void {
    this.store.dispatch(action);
  }
}
