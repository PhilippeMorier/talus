import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SceneViewerComponent } from './scene-viewer.component';
import { CameraFactory, EngineFactory, SceneViewerService } from './scene-viewer.service';

@NgModule({
  declarations: [SceneViewerComponent],
  imports: [CommonModule],
  exports: [SceneViewerComponent],
  providers: [CameraFactory, EngineFactory, SceneViewerService],
})
export class SceneViewerModule {}
