import { boolean, text } from '@storybook/addon-knobs';
import { UiStatusBarComponent } from './status-bar.component';
import { UiStatusBarModule } from './status-bar.module';

export default {
  title: 'UiStatusBarComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [UiStatusBarModule],
  },
  component: UiStatusBarComponent,
  props: {
    connected: boolean('connected', false),
    status: text('status', 'Your status text'),
  },
});
