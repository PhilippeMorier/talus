import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import { MenuBarComponent } from './menu-bar.component';

@NgModule({
  declarations: [MenuBarComponent],
  imports: [CommonModule, MatToolbarModule],
  exports: [MenuBarComponent],
})
export class MenuBarModule {}
