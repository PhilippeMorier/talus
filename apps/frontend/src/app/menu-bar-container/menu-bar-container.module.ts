import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiMenuBarModule } from '@talus/ui';
import { MenuBarContainerComponent } from './menu-bar-container.component';

@NgModule({
  declarations: [MenuBarContainerComponent],
  imports: [CommonModule, UiMenuBarModule],
  exports: [MenuBarContainerComponent],
})
export class MenuBarContainerModule {}
