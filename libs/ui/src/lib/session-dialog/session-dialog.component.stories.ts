import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { array } from '@storybook/addon-knobs';
import { Observable } from 'rxjs';
import { UiSessionDialogModule } from './session-dialog.module';
import { UiSessionDialogService } from './session-dialog.service';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: `
    <button (click)="onOpenClick()">Open</button>

    <div>Selected session: {{ results$ | async }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SessionDialogTestComponent implements OnInit {
  @Input() sessions: string[];

  results$: Observable<string | undefined>;

  constructor(private readonly dialogService: UiSessionDialogService) {}

  ngOnInit(): void {
    this.onOpenClick();
  }

  onOpenClick(): void {
    const dialogRef = this.dialogService.open(this.sessions);

    this.results$ = dialogRef.afterClosed();
  }
}

export default {
  title: 'UiSessionDialogComponent',
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [SessionDialogTestComponent],
    imports: [CommonModule, UiSessionDialogModule],
  },
  component: SessionDialogTestComponent,
  props: {
    sessions: array('sessions', ['session-1', 'session-2']),
  },
});
