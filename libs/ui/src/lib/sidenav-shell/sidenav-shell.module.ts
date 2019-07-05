import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatSidenavModule } from '@angular/material';
import { SidenavShellComponent } from './sidenav-shell.component';

@NgModule({
  declarations: [SidenavShellComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSidenavModule],
  exports: [SidenavShellComponent]
})
export class SidenavShellModule {}
