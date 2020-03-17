import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiProgressSpinnerModule } from '@talus/ui';

import { UiProgressSpinnerComponent } from './progress-spinner.component';

describe('UiProgressSpinnerComponent', () => {
  let component: UiProgressSpinnerComponent;
  let fixture: ComponentFixture<UiProgressSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiProgressSpinnerModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
