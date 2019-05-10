import { Injectable } from '@angular/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { Scene } from '@babylonjs/core/scene';

@Injectable()
export class SceneService {
  scene: Scene;

  private engine: Engine;
  // @ts-ignore: noUnusedLocals
  private light: HemisphericLight;
  private canvas: HTMLCanvasElement;

  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.engine = new Engine(this.canvas);

    this.createScene();
    this.createCamera();
    this.createLight();
  }

  startRendering(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }

  private createScene(): void {
    this.scene = new Scene(this.engine);
    // this.scene.debugLayer.show();
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
    camera.attachControl(this.engine.getRenderingCanvas(), true, false, 2);
    camera.setPosition(new Vector3(256, 256, 256));
    camera.panningSensibility = 10;
  }

  private createLight(): void {
    this.light = new HemisphericLight('light', new Vector3(0, 1, 1), this.scene);
  }
}
