import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface UiTopicDialogSelectionResult {
  isNewTopic: boolean;
  topicName: string;
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
          <span>Topic selection</span>
          <span class="spacer"></span>
          <mat-icon cdkDragHandle>open_with</mat-icon>
        </mat-toolbar>
      </h1>

      <div mat-dialog-content>
        <form [formGroup]="topicFrom">
          <mat-radio-group class="topic-radio-group" formControlName="topicName">
            <label>Create a topic</label>

            <mat-radio-button
              class="topic-radio-button"
              (change)="isNewTopic = true"
              [value]="newNameInput.value"
            >
              <mat-form-field class="example-full-width">
                <input
                  #newNameInput
                  formControlName="topicName"
                  matInput
                  placeholder="New topic name"
                />
              </mat-form-field>
            </mat-radio-button>

            <label id="existingTopicsLabel">Or select an existing</label>

            <mat-radio-button
              class="topic-radio-button"
              *ngFor="let topic of topics"
              (change)="isNewTopic = false"
              [value]="topic"
            >
              {{ topic }}
            </mat-radio-button>
          </mat-radio-group>
        </form>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancelClick()">Cancel</button>
        <button mat-button (click)="onOkClick()" [disabled]="!topicFrom.valid">
          Ok
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./topic-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTopicDialogComponent {
  topicFrom = this.fb.group({
    topicName: ['', Validators.required],
  });

  isNewTopic = true;

  constructor(
    private readonly dialogRef: MatDialogRef<UiTopicDialogComponent, UiTopicDialogSelectionResult>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public topics: string[],
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    const topicNameControl = this.topicFrom.get('topicName');

    if (topicNameControl) {
      this.dialogRef.close({ topicName: topicNameControl.value, isNewTopic: this.isNewTopic });
    }
  }
}
