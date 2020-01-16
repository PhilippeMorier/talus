import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiToolbarModule } from '@talus/ui';
import { ToolsPanelComponent } from './tools-panel.component';

@NgModule({
  declarations: [ToolsPanelComponent],
  imports: [CommonModule, UiToolbarModule],
  exports: [ToolsPanelComponent],
})
export class ToolsPanelModule {}
