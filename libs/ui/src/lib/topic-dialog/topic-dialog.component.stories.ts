import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { array } from '@storybook/addon-knobs';
import { Observable } from 'rxjs';
import { UiTopicDialogSelectionResult } from './topic-dialog.component';
import { UiTopicDialogModule } from './topic-dialog.module';
import { UiTopicDialogService } from './topic-dialog.service';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: `
    <button (click)="onOpenClick()">Open</button>

    <div>Selected topic: {{ results$ | async | json }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TopicDialogTestComponent implements OnInit {
  @Input() topics: string[] = [];

  results$ = new Observable<UiTopicDialogSelectionResult | undefined>();

  constructor(private readonly dialogService: UiTopicDialogService) {}

  ngOnInit(): void {
    this.onOpenClick();
  }

  onOpenClick(): void {
    const dialogRef = this.dialogService.open(this.topics);

    this.results$ = dialogRef.afterClosed();
  }
}

export default {
  title: 'UiTopicDialogComponent',
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [TopicDialogTestComponent],
    imports: [CommonModule, UiTopicDialogModule],
  },
  component: TopicDialogTestComponent,
  props: {
    topics: array('topics', ['topic-1', 'topic-2']),
  },
});
