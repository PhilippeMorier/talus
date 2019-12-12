import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToolbarModule } from '@talus/ui';
import { ToolsPanelComponent } from './tools-panel.component';

@NgModule({
  declarations: [ToolsPanelComponent],
  imports: [CommonModule, ToolbarModule],
  exports: [ToolsPanelComponent],
})
export class ToolsPanelModule {}
