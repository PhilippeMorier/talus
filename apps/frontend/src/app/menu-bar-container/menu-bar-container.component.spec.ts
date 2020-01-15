import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuBarContainerComponent } from './menu-bar-container.component';

describe('MenuBarComponent', () => {
  let component: MenuBarContainerComponent;
  let fixture: ComponentFixture<MenuBarContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuBarContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBarContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
