import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiStatusBarComponent } from './status-bar.component';

@NgModule({
  declarations: [UiStatusBarComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  exports: [UiStatusBarComponent],
})
export class UiStatusBarModule {}
