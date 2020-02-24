import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { UiSceneViewerModule, UiSessionDialogModule } from '@talus/ui';
import { GridService } from './grid.service';
import { SceneViewerContainerComponent } from './scene-viewer-container.component';
import { SceneViewerContainerEffects } from './scene-viewer-container.effects';

@NgModule({
  declarations: [SceneViewerContainerComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([SceneViewerContainerEffects]),
    UiSceneViewerModule,
    UiSessionDialogModule,
  ],
  exports: [SceneViewerContainerComponent],
  providers: [GridService],
})
export class SceneViewerContainerModule {}
