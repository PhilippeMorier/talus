import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavShellComponent } from './sidenav-shell.component';

describe('SidenavShellComponent', () => {
  let component: SidenavShellComponent;
  let fixture: ComponentFixture<SidenavShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
