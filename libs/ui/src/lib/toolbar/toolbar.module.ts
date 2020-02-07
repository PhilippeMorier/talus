import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [UiToolbarComponent],
  imports: [CommonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  exports: [UiToolbarComponent],
})
export class UiToolbarModule {}
