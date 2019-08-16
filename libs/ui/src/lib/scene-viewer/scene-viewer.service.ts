import { Injectable } from '@angular/core';
import { MeshBuilder, Nullable, PickingInfo, PointerEventTypes, Scene } from '@babylonjs/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class EngineFactory {
  create(canvas: HTMLCanvasElement): Engine {
    return new Engine(canvas);
  }
}

@Injectable()
export class CameraFactory {
  create(
    name: string,
    alpha: number,
    beta: number,
    radius: number,
    target: Vector3,
    scene: Scene,
    setActiveOnSceneIfNoneActive?: boolean,
  ): ArcRotateCamera {
    return new ArcRotateCamera(
      name,
      alpha,
      beta,
      radius,
      target,
      scene,
      setActiveOnSceneIfNoneActive,
    );
  }
}

export function testCameraFactory(): any {
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
      camera.attachControl = () => {};

      return camera;
    },
  };
}

@Injectable()
export class Camera extends ArcRotateCamera {}

@Injectable()
export class SceneViewerService {
  scene: Scene;

  pointerUp$ = new Subject<PointerEvent>();

  private engine: Engine;
  // @ts-ignore: noUnusedLocals
  private light: HemisphericLight;
  private destroy$ = new Subject();

  constructor(private cameraFactory: CameraFactory, private engineFactory: EngineFactory) {}

  initialize(canvas: HTMLCanvasElement): void {
    this.engine = this.engineFactory.create(canvas);

    this.createScene();
    this.createCamera();
    this.createLight();

    this.registerWindowResize();
    this.registerPointerUp();
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startRendering(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }

  private createScene(): void {
    this.scene = new Scene(this.engine);

    MeshBuilder.CreateBox('box', {}, this.scene);
  }

  private createCamera(): void {
    const camera: ArcRotateCamera = this.cameraFactory.create(
      'camera',
      Math.PI / 2,
      Math.PI / 2,
      2,
      new Vector3(0, 0, 0),
      this.scene,
    );
    camera.inertia = 0;
    camera.panningInertia = 0;
    // https://forum.babylonjs.com/t/testing-my-project-with-jest/3988/4
    // Deltakosh, Sith Overlord, Jun 20
    // If you only need to do unit testing, you should use the NullEngine and not attach your camera
    // This is what we do for all our unit tests on babylon.js CI
    camera.attachControl(this.engine.getRenderingCanvas(), true, false, 2);
    camera.setPosition(new Vector3(32, 32, 32));
    camera.panningSensibility = 10;
  }

  private createLight(): void {
    this.light = new HemisphericLight('light', new Vector3(0, 1, 1), this.scene);
  }

  private registerPointerUp(): void {
    this.scene.onPointerUp = (
      event: PointerEvent,
      pickInfo: Nullable<PickingInfo>,
      type: PointerEventTypes,
    ): void => {
      this.pointerUp$.next(event);
    };
  }

  private registerWindowResize(): void {
    fromEvent(window, 'resize')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.engine.resize());
  }
}