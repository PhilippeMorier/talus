import { object } from '@storybook/addon-knobs';
import { UiMenuBarComponent, UiMenuBarConfig } from './menu-bar.component';
import { UiMenuBarModule } from './menu-bar.module';

export default {
  title: 'UiMenuBarComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [UiMenuBarModule],
  },
  component: UiMenuBarComponent,
  props: {
    menuConfig: object<UiMenuBarConfig<string>>('menuConfig', {
      menus: [
        {
          label: 'Edit',
          menuItems: [
            {
              icon: 'undo',
              label: 'Undo',
              value: 'Test undo value',
            },
            {
              icon: 'redo',
              label: 'Redo',
              value: 'Test redo value',
            },
          ],
        },
      ],
    }),
  },
});
