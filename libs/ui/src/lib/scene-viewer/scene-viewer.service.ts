import { Injectable } from '@angular/core';
import { MeshBuilder, Nullable, PickingInfo, PointerEventTypes, Scene } from '@babylonjs/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { Subject } from 'rxjs';

@Injectable()
export class SceneViewerService {
  scene: Scene;

  pointerUp$ = new Subject<PointerEvent>();

  private engine: Engine;
  // @ts-ignore: noUnusedLocals
  private light: HemisphericLight;

  initialize(canvas: HTMLCanvasElement): void {
    this.engine = new Engine(canvas);

    this.createScene();
    this.createCamera();
    this.createLight();

    this.registerPointerUp();
  }

  startRendering(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }

  private createScene(): void {
    this.scene = new Scene(this.engine);

    MeshBuilder.CreateBox('box', {}, this.scene);
  }

  private createCamera(): void {
    const camera: ArcRotateCamera = new ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2,
      2,
      new Vector3(0, 0, 0),
      this.scene,
    );
    camera.inertia = 0;
    camera.panningInertia = 0;
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
}
