import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SceneViewerComponent } from './scene-viewer.component';



@NgModule({
  declarations: [SceneViewerComponent],
  imports: [
    CommonModule
  ],
  exports: [SceneViewerComponent]
})
export class SceneViewerModule { }
