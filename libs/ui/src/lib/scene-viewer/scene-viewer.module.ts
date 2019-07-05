import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SceneViewerComponent } from './scene-viewer.component';

@NgModule({
  declarations: [SceneViewerComponent],
  imports: [CommonModule],
  exports: [SceneViewerComponent],
})
export class SceneViewerModule {}
