import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';
import { UiMenuBarComponent } from './menu-bar.component';

@NgModule({
  declarations: [UiMenuBarComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule],
  exports: [UiMenuBarComponent],
})
export class UiMenuBarModule {}
