import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavShellComponent } from './sidenav-shell.component';
import { MatButtonModule, MatIconModule, MatSidenavModule } from '@angular/material';

@NgModule({
  declarations: [SidenavShellComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSidenavModule],
  exports: [SidenavShellComponent]
})
export class SidenavShellModule {}
