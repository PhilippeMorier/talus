import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { number, object } from '@storybook/addon-knobs';
import { Observable } from 'rxjs';
import { UiColorDialogColor } from './color-dialog.component';
import { UiColorDialogModule } from './color-dialog.module';
import { UiColorDialogService } from './color-dialog.service';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: `
    <button (click)="onOpenClick()">Open</button>

    <div>Selected color index: {{ results$ | async | json }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class UiColorDialogTestComponent implements OnInit {
  @Input() colors: UiColorDialogColor[] = [];
  @Input() selectedColorIndex = 0;

  results$ = new Observable<number | undefined>();

  constructor(public dialogService: UiColorDialogService) {}

  ngOnInit(): void {
    this.onOpenClick();
  }

  onOpenClick(): void {
    const dialogRef = this.dialogService.open(this.colors, this.selectedColorIndex);

    this.results$ = dialogRef.afterClosed();
  }
}

export default {
  title: 'UiColorDialogComponent',
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [UiColorDialogTestComponent],
    imports: [CommonModule, UiColorDialogModule],
  },
  component: UiColorDialogTestComponent,
  props: {
    selectedColorIndex: number('selectedColorIndex', 0),
    colors: object<UiColorDialogColor[]>('colors', [
      { r: 255, g: 0, b: 0, a: 0.8 },
      { r: 0, g: 255, b: 0, a: 0.6 },
      { r: 0, g: 0, b: 255, a: 0.4 },
    ]),
  },
});
