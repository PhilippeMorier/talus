import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface UiColorDialogColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

@Component({
  template: `
    <div class="dialog-content">
      <h1
        mat-dialog-title
        cdkDrag
        cdkDragBoundary=".cdk-overlay-container"
        cdkDragRootElement=".cdk-overlay-pane"
      >
        <mat-toolbar>
          <span>Color Selector</span>
          <span class="spacer"></span>
          <mat-icon cdkDragHandle>drag_indicator</mat-icon>
        </mat-toolbar>
      </h1>

      <div mat-dialog-content>
        <p>Choose here your color.</p>

        <div class="color-container">
          <div
            class="color"
            *ngFor="let color of data.colors"
            [style.background-color]="getRgbaString(color)"
          ></div>
        </div>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancelClick()">Cancel</button>
        <button mat-button mat-dialog-close="Test answer">Select</button>
      </div>
    </div>
  `,
  styleUrls: ['./color-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiColorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UiColorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { colors: UiColorDialogColor[] },
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getRgbaString(color: UiColorDialogColor): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a} )`;
  }
}
