import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { object } from '@storybook/addon-knobs';
import { UiColorDialogColor, UiColorDialogComponent } from './color-dialog.component';
import { UiColorDialogModule } from './color-dialog.module';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: `
    <button mat-button (click)="openDialog()">Open</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class UiColorDialogTestComponent implements AfterViewInit {
  @Input() colors: UiColorDialogColor[];

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open<
      UiColorDialogComponent,
      { colors: UiColorDialogColor[] },
      UiColorDialogColor
    >(UiColorDialogComponent, {
      autoFocus: false,
      data: { colors: this.colors },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: ', result);
    });
  }
}

export default {
  title: 'UiColorDialogComponent',
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [UiColorDialogTestComponent],
    imports: [UiColorDialogModule],
  },
  component: UiColorDialogTestComponent,
  props: {
    colors: object<UiColorDialogColor[]>('colors', [
      { r: 255, g: 0, b: 0, a: 0.8 },
      { r: 0, g: 255, b: 0, a: 0.6 },
      { r: 0, g: 0, b: 255, a: 0.4 },
    ]),
  },
});
