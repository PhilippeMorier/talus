import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import {
  UiColorDialogColor,
  UiColorDialogComponent,
  UiColorDialogData,
} from './color-dialog.component';

@Injectable()
export class UiColorDialogService {
  constructor(public dialog: MatDialog) {}

  open(colors: UiColorDialogColor[]): MatDialogRef<UiColorDialogComponent, UiColorDialogColor> {
    const dialogRef = this.dialog.open<
      UiColorDialogComponent,
      UiColorDialogData,
      UiColorDialogColor
    >(UiColorDialogComponent, {
      autoFocus: false,
      data: { colors },
      width: '350px',
    });

    return dialogRef;
  }
}
