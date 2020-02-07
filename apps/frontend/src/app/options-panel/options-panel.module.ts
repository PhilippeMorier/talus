import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EffectsModule } from '@ngrx/effects';
import { UiColorDialogModule } from '@talus/ui';
import { OptionsPanelComponent } from './options-panel.component';
import { OptionsPanelEffects } from './options-panel.effects';

@NgModule({
  declarations: [OptionsPanelComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([OptionsPanelEffects]),
    MatButtonModule,
    MatIconModule,
    UiColorDialogModule,
  ],
  exports: [OptionsPanelComponent],
})
export class OptionsPanelModule {}
