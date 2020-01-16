import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { UiToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [UiToolbarComponent],
  imports: [CommonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  exports: [UiToolbarComponent],
})
export class UiToolbarModule {}
