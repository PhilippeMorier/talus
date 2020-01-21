import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { OptionsPanelComponent } from './options-panel.component';

@NgModule({
  declarations: [OptionsPanelComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [OptionsPanelComponent],
})
export class OptionsPanelModule {}
