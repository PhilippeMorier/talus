import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenav } from '@angular/material';
import { By } from '@angular/platform-browser';

import { UiSidenavShellComponent } from './sidenav-shell.component';
import { UiSidenavShellModule } from './sidenav-shell.module';

describe('SidenavShellComponent', () => {
  let component: UiSidenavShellComponent;
  let fixture: ComponentFixture<UiSidenavShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiSidenavShellModule],
      declarations: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSidenavShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have left & right sidenav', () => {
    const sidenavs = fixture.debugElement.queryAll(By.directive(MatSidenav));
    const leftSidenavIcon = fixture.debugElement.query(By.css('#left-sidenav-button mat-icon'));
    const rightSidenavIcon = fixture.debugElement.query(By.css('#right-sidenav-button mat-icon'));

    expect(sidenavs.length).toEqual(2);
    expect(leftSidenavIcon.nativeElement.textContent).toEqual('keyboard_arrow_left');
    expect(rightSidenavIcon.nativeElement.textContent).toEqual('keyboard_arrow_right');
  });
});
