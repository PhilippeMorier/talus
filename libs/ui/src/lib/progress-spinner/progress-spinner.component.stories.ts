import { number, select, text } from '@storybook/addon-knobs';
import { UiProgressSpinnerComponent } from './progress-spinner.component';
import { UiProgressSpinnerModule } from './progress-spinner.module';

export default {
  title: 'UiProgressSpinnerComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [UiProgressSpinnerModule],
  },
  component: UiProgressSpinnerComponent,
  props: {
    color: select('color', ['primary', 'accent', 'warn'], 'primary'),
    mode: select('mode', ['determinate', 'indeterminate'], 'determinate'),
    status: text('status', 'loading...'),
    value: number('value', 42),
  },
});
