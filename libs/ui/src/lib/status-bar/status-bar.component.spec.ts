import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UiStatusBarComponent } from './status-bar.component';
import { UiStatusBarModule } from './status-bar.module';

describe('StatusBarComponent', () => {
  let component: UiStatusBarComponent;
  let fixture: ComponentFixture<UiStatusBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UiStatusBarModule],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UiStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
