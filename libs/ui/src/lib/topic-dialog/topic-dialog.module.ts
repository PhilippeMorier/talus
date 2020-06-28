import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  providers: [UiTopicDialogService],
})
export class UiTopicDialogModule {}
