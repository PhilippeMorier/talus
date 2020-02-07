import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
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
