import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { UiToolbarModule } from '@talus/ui';
import { ToolsPanelComponent } from './tools-panel.component';
import { ToolsPanelEffects } from './tools-panel.effects';

@NgModule({
  declarations: [ToolsPanelComponent],
  imports: [CommonModule, EffectsModule.forFeature([ToolsPanelEffects]), UiToolbarModule],
  exports: [ToolsPanelComponent],
})
export class ToolsPanelModule {}
