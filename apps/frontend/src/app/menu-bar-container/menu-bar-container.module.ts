import { NgModule } from '@angular/core';
import { MenuBarModule } from '@talus/ui';
import { MenuBarContainerComponent } from './menu-bar-container.component';

@NgModule({
  declarations: [MenuBarContainerComponent],
  imports: [MenuBarModule],
  exports: [MenuBarContainerComponent],
})
export class MenuBarContainerModule {}
