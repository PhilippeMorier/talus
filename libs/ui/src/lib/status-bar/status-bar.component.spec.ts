import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiStatusBarModule } from '@talus/ui';

import { UiStatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  let component: UiStatusBarComponent;
  let fixture: ComponentFixture<UiStatusBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiStatusBarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
