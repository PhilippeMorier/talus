import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsPanelComponent } from './options-panel.component';
import { OptionsPanelModule } from './options-panel.module';

describe('OptionsPanelComponent', () => {
  let component: OptionsPanelComponent;
  let fixture: ComponentFixture<OptionsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OptionsPanelModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
