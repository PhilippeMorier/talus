import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiColorDialogComponent } from './color-dialog.component';

@NgModule({
  declarations: [UiColorDialogComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
  ],
  entryComponents: [UiColorDialogComponent],
})
export class UiColorDialogModule {}
