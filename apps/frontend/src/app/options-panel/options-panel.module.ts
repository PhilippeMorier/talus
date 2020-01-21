import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { UiColorDialogModule } from '@talus/ui';
import { OptionsPanelComponent } from './options-panel.component';

@NgModule({
  declarations: [OptionsPanelComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, UiColorDialogModule],
  exports: [OptionsPanelComponent],
})
export class OptionsPanelModule {}
