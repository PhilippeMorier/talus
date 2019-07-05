import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SceneViewerComponent } from './scene-viewer.component';
import { SceneViewerService } from './scene-viewer.service';

@NgModule({
  declarations: [SceneViewerComponent],
  imports: [CommonModule],
  exports: [SceneViewerComponent],
  providers: [SceneViewerService],
})
export class SceneViewerModule {}
