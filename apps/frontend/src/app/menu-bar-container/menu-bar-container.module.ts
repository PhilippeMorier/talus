import { NgModule } from '@angular/core';
import { UiMenuBarModule } from '@talus/ui';
import { MenuBarContainerComponent } from './menu-bar-container.component';

@NgModule({
  declarations: [MenuBarContainerComponent],
  imports: [UiMenuBarModule],
  exports: [MenuBarContainerComponent],
})
export class MenuBarContainerModule {}
