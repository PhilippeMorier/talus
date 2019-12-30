import { Injectable } from '@angular/core';
// Babylon.js needs to target individual files to fully benefit from tree shaking.
// See: https://doc.babylonjs.com/features/es6_support#tree-shaking
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { PickingInfo } from '@babylonjs/core/Collisions/pickingInfo';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/core/Materials/standardMaterial';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/core/Physics/physicsHelper'; // Needed for `onPointerPick`
import { Scene } from '@babylonjs/core/scene';
// import '@babylonjs/loaders/glTF/glTFFileLoader';
import '@babylonjs/loaders/OBJ/objFileLoader';
import { Coord, MeshData } from '@talus/vdb';
import { Subject } from 'rxjs';
import { PointerButton } from './pointer-button';

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

/**
 * This service allows to set a new mesh for `SceneViewerComponent` to render. This service is
 * provided on module level. Therefore, only one `SceneViewerComponent` at the time is supported.
 */
@Injectable()
export class SceneViewerService {
  constructor(private cameraFactory: CameraFactory, private engineFactory: EngineFactory) {}
  scene: Scene;

  pointerPick$ = new Subject<PointerPickInfo>();

  private engine: Engine;
  // @ts-ignore: noUnusedLocals
  private light: HemisphericLight;

  meshes = new Map<string, Mesh>();

  initialize(canvas: HTMLCanvasElement): void {
    this.engine = this.engineFactory.create(canvas);
    this.scene = new Scene(this.engine);

    this.createCamera();
    this.createLight();

    this.registerPointerPick();

    const box = MeshBuilder.CreateBox('box', {}, this.scene);
    box.position.x = 0.5;
    box.position.y = 0.5;
    box.position.z = 0.5;

    // this.loadObjFile(
    //   'https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/scenes/',
    //   'StanfordBunny.obj',
    // );
  }

  startRendering(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }

  resizeView(): void {
    this.engine.resize();

    // const meshes = Array.from(this.meshes.values());
    // Mesh.MergeMeshes(meshes, true, true);
  }

  updateGridMesh(mesh?: MeshData): void {
    const meshName = `grid[${mesh.origin}]`;

    this.scene.removeMesh(this.scene.getMeshByName(meshName));

    if (mesh) {
      const gridMesh = new Mesh(meshName, this.scene);
      const data = new VertexData();

      data.colors = mesh.colors;
      data.indices = mesh.indices;
      data.positions = mesh.positions;

      data.applyToMesh(gridMesh);
      gridMesh.convertToFlatShadedMesh();

      this.meshes.set(meshName, gridMesh);
    }
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
    camera.wheelPrecision = 0.1;

    camera.panningSensibility = 5;
    camera.angularSensibilityX = 200;
    camera.angularSensibilityY = 100;

    camera.attachControl(this.engine.getRenderingCanvas(), true, false, 2);
    camera.setPosition(new Vector3(400, 400, -400));
  }

  private createLight(): void {
    this.light = new HemisphericLight('light', new Vector3(0, 1, -2), this.scene);
  }

  private registerPointerPick(): void {
    this.scene.onPointerPick = (event: PointerEvent, pickInfo: PickingInfo): void => {
      const info: PointerPickInfo = {
        pickedPoint: vector3ToCoord(pickInfo.pickedPoint),
        pointerButton: event.button,
        normal: vector3ToCoord(pickInfo.getNormal()),
      };

      this.pointerPick$.next(info);
    };
  }

  private loadObjFile(filePath: string, fileName: string): void {
    SceneLoader.LoadAssetContainer(filePath, fileName, this.scene, container => {
      console.log('container', container.meshes[0].getVerticesData(VertexBuffer.PositionKind));
    });
  }
}

function vector3ToCoord(vector: Vector3): Coord {
  return [vector.x, vector.y, vector.z];
}

export interface PointerPickInfo {
  pickedPoint: Coord;
  pointerButton: PointerButton;
  normal: Coord;
}
