import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiMenuBarComponent } from './menu-bar.component';
import { UiMenuBarModule } from './menu-bar.module';

describe('UiMenuBarComponent', () => {
  let component: UiMenuBarComponent;
  let fixture: ComponentFixture<UiMenuBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiMenuBarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
