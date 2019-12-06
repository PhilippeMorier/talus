import { Injectable } from '@angular/core';
// Babylon.js needs to target individual files to fully benefit from tree shaking.
// See: https://doc.babylonjs.com/features/es6_support#tree-shaking
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { PickingInfo } from '@babylonjs/core/Collisions/pickingInfo';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import '@babylonjs/core/Materials/standardMaterial';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Physics/physicsHelper'; // Needed for `onPointerPick`
import { Scene } from '@babylonjs/core/scene';
import { Grid, gridToMesh } from '@talus/vdb';
import { Subject } from 'rxjs';

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

@Injectable()
export class SceneViewerService {
  scene: Scene;

  pointerPick$ = new Subject<PointerEvent>();
  meshPick$ = new Subject<AbstractMesh>();

  private engine: Engine;
  // @ts-ignore: noUnusedLocals
  private light: HemisphericLight;

  constructor(private cameraFactory: CameraFactory, private engineFactory: EngineFactory) {}

  initialize(canvas: HTMLCanvasElement): void {
    this.engine = this.engineFactory.create(canvas);

    this.createScene();
    this.createCamera();
    this.createLight();

    this.registerPointerPick();

    this.addGrid();
  }

  startRendering(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }

  resizeView(): void {
    this.engine.resize();
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

    camera.panningSensibility = 20;
    camera.angularSensibilityX = 200;
    camera.angularSensibilityY = 100;

    camera.attachControl(this.engine.getRenderingCanvas(), true, false, 2);
    camera.setPosition(new Vector3(20, 20, -20));
  }

  private createLight(): void {
    this.light = new HemisphericLight('light', new Vector3(0, 1, -1), this.scene);
  }

  private registerPointerPick(): void {
    this.scene.onPointerPick = (event: PointerEvent, pickInfo: PickingInfo): void => {
      this.pointerPick$.next(event);
      this.meshPick$.next(pickInfo.pickedMesh);
    };
  }

  private addGrid(): void {
    const grid = new Grid(0);
    const accessor = grid.getAccessor();

    for (let x = -10; x < 10; x++) {
      for (let z = -10; z < 10; z++) {
        accessor.setValue([x, Math.sin(z / 4) * 10, z], 1);
      }
    }

    const mesh = gridToMesh(grid);

    const gridMesh = new Mesh('grid', this.scene);
    const data = new VertexData();

    data.colors = mesh.colors;
    data.indices = mesh.indices;
    data.normals = mesh.normals;
    data.positions = mesh.positions;

    data.applyToMesh(gridMesh);
    gridMesh.convertToFlatShadedMesh();
  }
}
