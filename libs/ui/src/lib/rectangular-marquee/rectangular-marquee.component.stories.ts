import { UiRectangularMarqueeComponent } from './rectangular-marquee.component';
import { UiRectangularMarqueeModule } from './rectangular-marquee.module';

export default {
  title: 'UiRectangularMarqueeComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [UiRectangularMarqueeModule],
  },
  component: UiRectangularMarqueeComponent,
  props: {},
});
