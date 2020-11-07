import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UiRectangularMarqueeComponent } from './rectangular-marquee.component';
import { UiRectangularMarqueeModule } from './rectangular-marquee.module';

describe('UiRectangularMarqueeComponent', () => {
  let component: UiRectangularMarqueeComponent;
  let fixture: ComponentFixture<UiRectangularMarqueeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UiRectangularMarqueeModule],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UiRectangularMarqueeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
