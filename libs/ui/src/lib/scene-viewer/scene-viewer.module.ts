import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiSceneViewerComponent } from './scene-viewer.component';
import { CameraFactory, EngineFactory, SceneViewerService } from './scene-viewer.service';

@NgModule({
  declarations: [UiSceneViewerComponent],
  imports: [CommonModule],
  exports: [UiSceneViewerComponent],
  providers: [CameraFactory, EngineFactory, SceneViewerService],
})
export class UiSceneViewerModule {}
