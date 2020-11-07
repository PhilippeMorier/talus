import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSidenav } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';
import { UiSidenavShellComponent } from './sidenav-shell.component';
import { UiSidenavShellModule } from './sidenav-shell.module';

// Skipped due to:
// TypeError: Cannot read property 'runOutsideAngular' of undefined
// at MatSidenav.ChangeDetectionStrategy (/Users/philippe/git/src/material/sidenav/drawer.ts:292:18)
describe.skip('SidenavShellComponent', () => {
  let component: UiSidenavShellComponent;
  let fixture: ComponentFixture<UiSidenavShellComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UiSidenavShellModule],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSidenavShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have open left & right sidenav', () => {
    const sidenavs = fixture.debugElement.queryAll(By.directive(MatSidenav));
    const leftSidenavIcon = fixture.debugElement.query(By.css('#left-sidenav-button mat-icon'));
    const rightSidenavIcon = fixture.debugElement.query(By.css('#right-sidenav-button mat-icon'));

    expect(sidenavs.length).toEqual(2);
    expect(leftSidenavIcon.nativeElement.textContent).toEqual('keyboard_arrow_left');
    expect(rightSidenavIcon.nativeElement.textContent).toEqual('keyboard_arrow_right');
  });

  it('should close left & right sidenav', () => {
    // Close left sidenav
    const leftSidenavButton = fixture.debugElement.query(By.css('#left-sidenav-button'));
    leftSidenavButton.nativeElement.click();
    fixture.detectChanges();

    const leftIconClosed = fixture.debugElement.query(By.css('#left-sidenav-button mat-icon'));
    expect(leftIconClosed.nativeElement.textContent).toEqual('keyboard_arrow_right');

    // Close right sidenav
    const rightSidenavButton = fixture.debugElement.query(By.css('#right-sidenav-button'));
    rightSidenavButton.nativeElement.click();
    fixture.detectChanges();

    const rightIconClosed = fixture.debugElement.query(By.css('#right-sidenav-button mat-icon'));
    expect(rightIconClosed.nativeElement.textContent).toEqual('keyboard_arrow_left');
  });
});
