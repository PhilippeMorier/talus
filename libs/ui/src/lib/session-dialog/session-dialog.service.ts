import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UiSessionDialogComponent } from './session-dialog.component';

@Injectable()
export class UiSessionDialogService {
  constructor(public dialog: MatDialog) {}

  open(sessions$: Observable<string[]>): MatDialogRef<UiSessionDialogComponent, string> {
    const dialogRef = this.dialog.open<UiSessionDialogComponent, Observable<string[]>, string>(
      UiSessionDialogComponent,
      {
        autoFocus: false,
        data: sessions$,
        width: '350px',
      },
    );

    return dialogRef;
  }
}
