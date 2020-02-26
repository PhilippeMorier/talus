import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiTopicDialogComponent } from './topic-dialog.component';
import { UiTopicDialogService } from './topic-dialog.service';

@NgModule({
  declarations: [UiTopicDialogComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatRadioModule,
    MatToolbarModule,
  ],
  providers: [UiTopicDialogService],
  entryComponents: [UiTopicDialogComponent],
})
export class UiTopicDialogModule {}
