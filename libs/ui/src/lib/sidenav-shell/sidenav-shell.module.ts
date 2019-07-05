import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavShellComponent } from './sidenav-shell.component';

@NgModule({
  declarations: [SidenavShellComponent],
  imports: [CommonModule],
  exports: [SidenavShellComponent]
})
export class SidenavShellModule {}
