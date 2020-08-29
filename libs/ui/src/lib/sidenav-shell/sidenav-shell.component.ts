import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-sidenav-shell-content',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSidenavShellContentComponent {}

@Component({
  selector: 'ui-sidenav-shell-left',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-flow: column;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSidenavShellLeftComponent {}

@Component({
  selector: 'ui-sidenav-shell-right',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSidenavShellRightComponent {}

@Component({
  selector: 'ui-sidenav-shell',
  template: `
    <mat-sidenav-container [hasBackdrop]="false" class="example-container">
      <mat-sidenav
        data-cy="left-sidenav"
        #leftSidenav
        mode="over"
        position="start"
        [autoFocus]="false"
        [opened]="true"
      >
        <button mat-mini-fab id="left-sidenav-button" (click)="leftSidenav.toggle()">
          <mat-icon *ngIf="leftSidenav.opened">keyboard_arrow_left</mat-icon>
          <mat-icon *ngIf="!leftSidenav.opened">keyboard_arrow_right</mat-icon>
        </button>

        <ng-content select="ui-sidenav-shell-left"></ng-content>
      </mat-sidenav>

      <mat-sidenav
        data-cy="right-sidenav"
        #rightSidenav
        mode="over"
        position="end"
        [autoFocus]="false"
        [opened]="true"
      >
        <button mat-mini-fab id="right-sidenav-button" (click)="rightSidenav.toggle()">
          <mat-icon *ngIf="rightSidenav.opened">keyboard_arrow_right</mat-icon>
          <mat-icon *ngIf="!rightSidenav.opened">keyboard_arrow_left</mat-icon>
        </button>

        <ng-content select="ui-sidenav-shell-right"></ng-content>
      </mat-sidenav>

      <mat-sidenav-content>
        <ng-content select="ui-sidenav-shell-content"></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./sidenav-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSidenavShellComponent {}
