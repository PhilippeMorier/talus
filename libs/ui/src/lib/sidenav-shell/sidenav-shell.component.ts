import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'ui-sidenav-shell-content',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavShellContentComponent {}

@Component({
  selector: 'ui-sidenav-shell-left',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SidenavShellLeftComponent {}
@Component({
  selector: 'ui-sidenav-shell-right',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavShellRightComponent {}

@Component({
  selector: 'ui-sidenav-shell',
  template: `
    <mat-sidenav-container [hasBackdrop]="false" class="example-container">
      <mat-sidenav
        #leftSidenav
        mode="over"
        position="start"
        [autoFocus]="false"
        [opened]="true"
      >
        <button
          mat-mini-fab
          id="left-sidenav-button"
          (click)="leftSidenav.toggle()"
        >
          <mat-icon *ngIf="leftSidenav.opened">keyboard_arrow_left</mat-icon>
          <mat-icon *ngIf="!leftSidenav.opened">keyboard_arrow_right</mat-icon>
        </button>

        <ng-content select="ui-sidenav-shell-left"></ng-content>
      </mat-sidenav>

      <mat-sidenav
        #rightSidenav
        mode="over"
        position="end"
        [autoFocus]="false"
        [opened]="true"
      >
        <button
          mat-mini-fab
          id="right-sidenav-button"
          (click)="rightSidenav.toggle()"
        >
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
  styleUrls: ['./sidenav-shell.component.scss']
})
export class SidenavShellComponent implements OnInit {
  constructor() {}

  public ngOnInit(): void {}
}