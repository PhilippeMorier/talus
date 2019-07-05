import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatSidenavModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavShellModule } from '@talus/ui';

import {
  SidenavShellComponent,
  SidenavShellContentComponent,
  SidenavShellLeftComponent,
  SidenavShellRightComponent,
} from './sidenav-shell.component';

describe('SidenavShellComponent', () => {
  let component: SidenavShellComponent;
  let fixture: ComponentFixture<SidenavShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SidenavShellModule],
      declarations: [],
    }).compileComponents();
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
