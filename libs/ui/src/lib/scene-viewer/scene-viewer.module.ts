import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiSceneViewerComponent } from './scene-viewer.component';
import { CameraFactory, EngineFactory, UiSceneViewerService } from './scene-viewer.service';

@NgModule({
  declarations: [UiSceneViewerComponent],
  imports: [CommonModule],
  exports: [UiSceneViewerComponent],
  providers: [CameraFactory, EngineFactory, UiSceneViewerService],
})
export class UiSceneViewerModule {}
