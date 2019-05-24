import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tls-editor-shell',
  template: `
    <mat-sidenav-container [hasBackdrop]="false" class="example-container">
      <mat-sidenav #leftSidenav mode="over" position="start" [autoFocus]="false" [opened]="true">
        <button mat-mini-fab id="left-sidenav-button" (click)="leftSidenav.toggle()">
          <mat-icon *ngIf="leftSidenav.opened">keyboard_arrow_left</mat-icon>
          <mat-icon *ngIf="!leftSidenav.opened">keyboard_arrow_right</mat-icon>
        </button>
        <p>Left</p>
      </mat-sidenav>

      <mat-sidenav #rightSidenav mode="over" position="end" [autoFocus]="false" [opened]="true">
        <button mat-mini-fab id="right-sidenav-button" (click)="rightSidenav.toggle()">
          <mat-icon *ngIf="rightSidenav.opened">keyboard_arrow_right</mat-icon>
          <mat-icon *ngIf="!rightSidenav.opened">keyboard_arrow_left</mat-icon>
        </button>
        <p>Right</p>
      </mat-sidenav>

      <mat-sidenav-content>
        <tls-viewport></tls-viewport>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./editor-shell.component.scss'],
})
export class EditorShellComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
