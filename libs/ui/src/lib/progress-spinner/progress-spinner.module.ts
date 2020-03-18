import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiProgressSpinnerComponent } from './progress-spinner.component';

@NgModule({
  declarations: [UiProgressSpinnerComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [UiProgressSpinnerComponent],
})
export class UiProgressSpinnerModule {}
