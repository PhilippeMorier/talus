import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
          <span>Topic selection</span>
          <span class="spacer"></span>
          <mat-icon cdkDragHandle>open_with</mat-icon>
        </mat-toolbar>
      </h1>

      <div mat-dialog-content>
        <label id="topic-radio-group-label">Choose or create a topic</label>

        <mat-radio-group aria-labelledby="topic-radio-group-label" class="topic-radio-group">
          <mat-radio-button
            class="topic-radio-button"
            *ngFor="let topic of topics"
            [value]="topic"
            [mat-dialog-close]="topic"
          >
            {{ topic }}
          </mat-radio-button>
        </mat-radio-group>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancelClick()">Cancel</button>
      </div>
    </div>
  `,
  styleUrls: ['./topic-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTopicDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UiTopicDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public topics: string[],
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
