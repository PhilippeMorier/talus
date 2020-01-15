import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { MenuBarComponent } from './menu-bar.component';

@NgModule({
  declarations: [MenuBarComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule],
  exports: [MenuBarComponent],
})
export class MenuBarModule {}
