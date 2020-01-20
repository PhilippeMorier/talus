import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { text } from '@storybook/addon-knobs';
import { UiColorDialogComponent } from './color-dialog.component';
import { UiColorDialogModule } from './color-dialog.module';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: `
    <button mat-button (click)="openDialog()">Open</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class UiDraggableDialogTestComponent {
  result: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(UiColorDialogComponent, {
      autoFocus: false,
      data: { result: this.result },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.result = result;
    });
  }
}

export default {
  title: 'UiDraggableDialogComponent',
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [UiDraggableDialogTestComponent],
    imports: [UiColorDialogModule],
  },
  // template: `<button>Hello</button>`,
  component: UiDraggableDialogTestComponent,
  props: {
    result: text('result', 'Result text'),
  },
});
