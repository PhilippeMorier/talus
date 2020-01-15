import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface UiMenuBarConfig<T> {
  menus: UiMenuBarMenu<T>[];
}

interface UiMenuBarMenu<T> {
  label: string;
  menuItems: UiMenuBarMenuItem<T>[];
}

interface UiMenuBarMenuItem<T> {
  icon?: string;
  label: string;
  value: T;
}

@Component({
  selector: 'ui-menu-bar',
  template: `
    <mat-toolbar>
      <ng-container *ngFor="let menu of menuConfig.menus">
        <button mat-button [matMenuTriggerFor]="mainMenu">{{ menu.label }}</button>
        <mat-menu #mainMenu="matMenu">
          <button
            mat-menu-item
            *ngFor="let menuItem of menu.menuItems"
            (click)="onMenuItemClick(menuItem.value)"
          >
            <mat-icon *ngIf="menuItem.icon">{{ menuItem.icon }}</mat-icon>
            <span>{{ menuItem.label }}</span>
          </button>
        </mat-menu>
      </ng-container>
    </mat-toolbar>
  `,
  styleUrls: ['./menu-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuBarComponent {
  @Input() menuConfig: UiMenuBarConfig<any>;

  @Output() menuItemClick = new EventEmitter();

  onMenuItemClick(value: any): void {
    this.menuItemClick.emit(value);
  }
}
