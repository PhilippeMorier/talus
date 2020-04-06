import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { UiFullscreenOverlayModule, UiSceneViewerModule, UiTopicDialogModule } from '@talus/ui';
import { GridService } from './grid.service';
import { LoadFileContainerModule } from './load-file-container/load-file-container.module';
import { SceneViewerContainerComponent } from './scene-viewer-container.component';
import { SceneViewerContainerEffects } from './scene-viewer-container.effects';

@NgModule({
  declarations: [SceneViewerContainerComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([SceneViewerContainerEffects]),
    LoadFileContainerModule,
    UiFullscreenOverlayModule,
    UiSceneViewerModule,
    UiTopicDialogModule,
  ],
  exports: [SceneViewerContainerComponent],
  providers: [GridService],
})
export class SceneViewerContainerModule {}
