import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatSidenavModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  SidenavShellComponent,
  SidenavShellContentComponent,
  SidenavShellLeftComponent,
  SidenavShellRightComponent,
} from './sidenav-shell.component';

@NgModule({
  declarations: [
    SidenavShellComponent,
    SidenavShellContentComponent,
    SidenavShellLeftComponent,
    SidenavShellRightComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
  ],
  exports: [
    SidenavShellComponent,
    SidenavShellContentComponent,
    SidenavShellLeftComponent,
    SidenavShellRightComponent,
  ],
})
export class SidenavShellModule {}
