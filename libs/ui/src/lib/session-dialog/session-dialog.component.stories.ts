import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { array } from '@storybook/addon-knobs';
import { BehaviorSubject, Observable } from 'rxjs';
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
class SessionDialogTestComponent implements OnInit, OnChanges {
  @Input() sessions: string[];
  sessionsSubject$ = new BehaviorSubject<string[]>(this.sessions);

  results$: Observable<string | undefined>;

  constructor(private readonly dialogService: UiSessionDialogService) {}

  ngOnInit(): void {
    this.onOpenClick();
  }

  ngOnChanges({ sessions }: SimpleChanges): void {
    if (sessions) {
      console.log(sessions);
      this.sessionsSubject$.next(sessions.currentValue);
    }
  }

  onOpenClick(): void {
    const dialogRef = this.dialogService.open(this.sessionsSubject$.asObservable());

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
