import { Injectable } from '@angular/core';
// Babylon.js needs to target individual files to fully benefit from tree shaking.
// See: https://doc.babylonjs.com/features/es6_support#tree-shaking
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { PickingInfo } from '@babylonjs/core/Collisions/pickingInfo';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import '@babylonjs/core/Materials/standardMaterial';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import '@babylonjs/core/Physics/physicsHelper'; // Needed for `onPointerPick`
import { Scene } from '@babylonjs/core/scene';
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
  pointerPick$ = new Subject<PointerPickInfo>();

  private engine: Engine;
  private scene: Scene;
  private gridNode: TransformNode;
  // @ts-ignore: noUnusedLocals
  private light: HemisphericLight;

  constructor(private cameraFactory: CameraFactory, private engineFactory: EngineFactory) {}

  initialize(canvas: HTMLCanvasElement): void {
    this.engine = this.engineFactory.create(canvas);
    this.createScene();
    this.createCamera();
    this.createLight();

    this.registerPointerPick();

    const box = MeshBuilder.CreateBox('box', {}, this.scene);
    box.position.x = 0.5;
    box.position.y = 0.5;
    box.position.z = 0.5;
  }

  startRendering(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }

  resizeView(): void {
    this.engine.resize();
  }

  updateGridMesh(mesh?: MeshData): void {
    const meshName = `node1 [${mesh.origin}]`;

    this.deleteMesh(meshName);

    if (mesh) {
      const data = new VertexData();
      const nodeMesh = new Mesh(meshName, this.scene, this.gridNode);
      // https://www.html5gamedevs.com/topic/31617-mesh-without-indices/?tab=comments#comment-181659
      // https://doc.babylonjs.com/how_to/optimizing_your_scene#using-unindexed-meshes
      nodeMesh._unIndexed = true;

      data.colors = mesh.colors;
      data.normals = mesh.normals;
      data.positions = mesh.positions;

      data.applyToMesh(nodeMesh);

      // https://doc.babylonjs.com/how_to/optimizing_your_scene
      // https://www.html5gamedevs.com/topic/12504-performancedraw-calls/
      nodeMesh.freezeNormals();
      nodeMesh.freezeWorldMatrix();
    }
  }

  private createScene(): void {
    // https://doc.babylonjs.com/how_to/optimizing_your_scene
    this.scene = new Scene(this.engine, {
      useGeometryUniqueIdsMap: true,
      useClonedMeshhMap: true,
    });
    this.scene.freezeMaterials();

    // Used only as parent to have all nodes grouped together
    this.gridNode = new TransformNode('grid', this.scene);
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
        normal: this.getNormal(pickInfo),
      };

      this.pointerPick$.next(info);
    };
  }

  /**
   * PickingInfo.getNormal() requires to have indices which are not available
   * for an unindexed custom mesh. Therefore, read normals directly from picked mesh.
   *
   * https://github.com/BabylonJS/Babylon.js/blob/master/src/Collisions/pickingInfo.ts#L65
   */
  private getNormal(pickInfo: PickingInfo): Coord {
    const normals = pickInfo.pickedMesh.getVerticesData(VertexBuffer.NormalKind);

    return [
      normals[pickInfo.faceId * 9],
      normals[pickInfo.faceId * 9 + 1],
      normals[pickInfo.faceId * 9 + 2],
    ];
  }

  private deleteMesh(name: string): void {
    const oldMesh = this.scene.getMeshByName(name);

    if (oldMesh) {
      oldMesh.dispose();
    }
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
