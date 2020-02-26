import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UiTopicDialogComponent } from './topic-dialog.component';

@Injectable()
export class UiTopicDialogService {
  constructor(public dialog: MatDialog) {}

  open(topics: string[]): MatDialogRef<UiTopicDialogComponent, string> {
    const dialogRef = this.dialog.open<UiTopicDialogComponent, string[], string>(
      UiTopicDialogComponent,
      {
        autoFocus: false,
        data: topics,
        width: '350px',
      },
    );

    return dialogRef;
  }
}
