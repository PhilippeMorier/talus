import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SceneViewerModule } from '@talus/ui';
import { SceneViewerContainerComponent } from './scene-viewer-container.component';

@NgModule({
  declarations: [SceneViewerContainerComponent],
  imports: [CommonModule, SceneViewerModule],
  exports: [SceneViewerContainerComponent],
})
export class SceneViewerContainerModule {}
