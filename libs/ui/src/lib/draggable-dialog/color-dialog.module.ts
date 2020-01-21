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
import { UiColorDialogService } from './color-dialog.service';

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
  providers: [UiColorDialogService],
  entryComponents: [UiColorDialogComponent],
})
export class UiColorDialogModule {}
