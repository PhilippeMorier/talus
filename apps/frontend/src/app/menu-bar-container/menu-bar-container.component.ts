import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
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
      label: 'File',
      menuItems: [
        {
          icon: 'note_add',
          label: 'Open/New',
          value: openTopicDialog({ topics: ['test-topic'] }),
        },
      ],
    },
    {
      label: 'Edit',
      menuItems: [
        {
          icon: 'undo',
          label: 'Undo',
          value: undo({ needsSync: true }),
        },
        {
          icon: 'redo',
          label: 'Redo',
          value: redo({ needsSync: true }),
        },
      ],
    },
  ];

  menus$ = this.store.pipe(
    select(fromApp.selectSceneViewerContainerState),
    map(state => state.isDarkTheme),
    map(isDarkTheme => [
      ...this.menus,
      {
        label: 'View',
        menuItems: [
          ...(isDarkTheme
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
