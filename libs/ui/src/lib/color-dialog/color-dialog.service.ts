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

  open(
    colors: UiColorDialogColor[],
    selectedColorIndex?: number,
  ): MatDialogRef<UiColorDialogComponent, number> {
    const dialogRef = this.dialog.open<UiColorDialogComponent, UiColorDialogData, number>(
      UiColorDialogComponent,
      {
        autoFocus: false,
        data: { colors, selectedColorIndex },
        width: '350px',
      },
    );

    return dialogRef;
  }
}
