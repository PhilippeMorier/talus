import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiProgressSpinnerComponent } from './progress-spinner.component';

describe('UiProgressSpinnerComponent', () => {
  let component: UiProgressSpinnerComponent;
  let fixture: ComponentFixture<UiProgressSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UiProgressSpinnerComponent],
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
