import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  UiSidenavShellComponent,
  UiSidenavShellContentComponent,
  UiSidenavShellLeftComponent,
  UiSidenavShellRightComponent,
} from './sidenav-shell.component';

@NgModule({
  declarations: [
    UiSidenavShellComponent,
    UiSidenavShellContentComponent,
    UiSidenavShellLeftComponent,
    UiSidenavShellRightComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
  ],
  exports: [
    UiSidenavShellComponent,
    UiSidenavShellContentComponent,
    UiSidenavShellLeftComponent,
    UiSidenavShellRightComponent,
  ],
})
export class UiSidenavShellModule {}
