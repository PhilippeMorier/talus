import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ArcRotateCamera, NullEngine, Scene, Vector3 } from '@babylonjs/core';
import { CameraFactory, EngineFactory, SceneViewerService } from './scene-viewer.service';

function testCameraFactory(): any {
  return {
    create: (
      name: string,
      alpha: number,
      beta: number,
      radius: number,
      target: Vector3,
      scene: Scene,
      setActiveOnSceneIfNoneActive?: boolean,
    ): ArcRotateCamera => {
      const camera = new ArcRotateCamera(
        name,
        alpha,
        beta,
        radius,
        target,
        scene,
        setActiveOnSceneIfNoneActive,
      );

      // https://forum.babylonjs.com/t/testing-my-project-with-jest/3988/4
      // Deltakosh, Sith Overlord, Jun 20
      // If you only need to do unit testing, you should use the NullEngine and not attach your camera
      // This is what we do for all our unit tests on babylon.js CI
      camera.attachControl = () => {};

      return camera;
    },
  };
}

function testEngineFactor(): any {
  return { create: () => new NullEngine() };
}

@Component({
  selector: 'ui-scene-viewer',
  template: ``,
})
export class SceneViewerMockComponent {}

@NgModule({
  declarations: [SceneViewerMockComponent],
  exports: [SceneViewerMockComponent],
  imports: [CommonModule],
  providers: [
    { provide: CameraFactory, useValue: testCameraFactory() },
    { provide: EngineFactory, useValue: testEngineFactor() },
    SceneViewerService,
  ],
})
export class SceneViewerTestModule {}