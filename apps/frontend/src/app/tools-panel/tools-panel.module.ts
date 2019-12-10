import { NgModule } from '@angular/core';
import { ToolbarModule } from '@talus/ui';
import { ToolsPanelComponent } from './tools-panel.component';

@NgModule({
  declarations: [ToolsPanelComponent],
  imports: [ToolbarModule],
  exports: [ToolsPanelComponent],
})
export class ToolsPanelModule {}
