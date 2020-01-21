import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fe-options-panel',
  template: `
    <button mat-icon-button>
      <mat-icon>color_lens</mat-icon>
      <mat-icon id="more-caret-icon">signal_cellular_4_bar</mat-icon>
      <mat-icon id="color-icon">fiber_manual_record</mat-icon>
    </button>
  `,
  styleUrls: ['./options-panel.component.scss'],
})
export class OptionsPanelComponent {}
