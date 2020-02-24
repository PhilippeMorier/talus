import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ui-session-dialog',
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
          <mat-icon cdkDragHandle>open_with</mat-icon>
        </mat-toolbar>
      </h1>

      <div mat-dialog-content>
        <label id="session-radio-group-label">Choose or create a session</label>

        <mat-radio-group aria-labelledby="session-radio-group-label" class="session-radio-group">
          <mat-radio-button
            class="session-radio-button"
            *ngFor="let session of sessions"
            [value]="session"
            [mat-dialog-close]="session"
          >
            {{ session }}
          </mat-radio-button>
        </mat-radio-group>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancelClick()">Cancel</button>
      </div>
    </div>
  `,
  styleUrls: ['./session-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSessionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UiSessionDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public sessions: string[],
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
