import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
