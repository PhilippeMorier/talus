import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiSessionDialogComponent } from './session-dialog.component';
import { UiSessionDialogService } from './session-dialog.service';

@NgModule({
  declarations: [UiSessionDialogComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
  ],
  providers: [UiSessionDialogService],
  entryComponents: [UiSessionDialogComponent],
})
export class UiSessionDialogModule {}
