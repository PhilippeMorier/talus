import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines';
import { NullEngine } from '@babylonjs/core/Engines/nullEngine';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Scene } from '@babylonjs/core/scene';
import {
  CameraFactory,
  CreateCameraFn,
  EngineFactory,
  UiSceneViewerService,
} from './scene-viewer.service';

function testCameraFactory(): { create: CreateCameraFn } {
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

function testEngineFactor(): { create(): Engine } {
  return { create: () => new NullEngine() };
}

@Component({
  selector: 'ui-scene-viewer',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSceneViewerStubComponent {}

@NgModule({
  declarations: [UiSceneViewerStubComponent],
  exports: [UiSceneViewerStubComponent],
  imports: [CommonModule],
  providers: [
    { provide: CameraFactory, useValue: testCameraFactory() },
    { provide: EngineFactory, useValue: testEngineFactor() },
    UiSceneViewerService,
  ],
})
export class UiSceneViewerTestModule {}
