import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SceneViewerComponent } from './scene-viewer.component';
import { CameraFactory, EngineFactory } from './scene-viewer.service';

@NgModule({
  declarations: [SceneViewerComponent],
  imports: [CommonModule],
  exports: [SceneViewerComponent],
  providers: [CameraFactory, EngineFactory],
})
export class SceneViewerModule {}
