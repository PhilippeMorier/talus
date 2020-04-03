import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { UiToolbarModule } from '@talus/ui';
import { GridService } from '../scene-viewer-container/grid.service';
import { ToolsPanelComponent } from './tools-panel.component';
import { ToolsPanelEffects } from './tools-panel.effects';

@NgModule({
  declarations: [ToolsPanelComponent],
  imports: [CommonModule, EffectsModule.forFeature([ToolsPanelEffects]), UiToolbarModule],
  providers: [GridService],
  exports: [ToolsPanelComponent],
})
export class ToolsPanelModule {}
