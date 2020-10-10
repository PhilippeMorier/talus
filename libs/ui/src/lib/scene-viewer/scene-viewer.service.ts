import { Injectable } from '@angular/core';
import { Light } from '@babylonjs/core';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
// Babylon.js needs to target individual files to fully benefit from tree shaking.
// See: https://doc.babylonjs.com/features/es6_support#tree-shaking
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera';
import { PickingInfo } from '@babylonjs/core/Collisions/pickingInfo';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { VertexBuffer } from '@babylonjs/core/Meshes/buffer';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import '@babylonjs/core/Physics/physicsHelper'; // Needed for `onPointerPick`
import { Scene } from '@babylonjs/core/scene';
import { Coord, MeshData } from '@talus/vdb';
import { Subject } from 'rxjs';
import { UiPointerButton } from './pointer-button';

export interface UiPointerPickInfo {
  pickedPoint: Coord;
  pointerButton: UiPointerButton;
  normal: Coord;
}

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
export class UiSceneViewerService {
  private actionManager?: ActionManager;
  private camera?: ArcRotateCamera;
  private canvas?: HTMLCanvasElement;
  private engine?: Engine;
  private gridNode?: TransformNode;
  private light?: Light;
  private scene?: Scene;
  private standardMaterial?: StandardMaterial;

  private pointerPickSubject$ = new Subject<UiPointerPickInfo>();
  pointerPick$ = this.pointerPickSubject$.asObservable();

  private pointUnderPointerSubject$ = new Subject<UiPointerPickInfo>();
  pointUnderPointer$ = this.pointUnderPointerSubject$.asObservable();

  constructor(private cameraFactory: CameraFactory, private engineFactory: EngineFactory) {}

  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.engine = this.engineFactory.create(canvas);
    this.scene = this.createScene(this.engine);
    this.light = createLight(this.scene);
    this.createCamera(this.scene);

    this.registerPointerEvents(this.scene);
  }

  startRendering(): void {
    this.engine?.runRenderLoop(() => this.scene?.render());
  }

  resizeView(): void {
    this.engine?.resize();
  }

  updateNodeMesh(mesh: MeshData | undefined, origin: Coord): void {
    if (!this.scene || !this.standardMaterial || !this.actionManager) {
      return;
    }

    const meshName = getMeshName(origin);

    deleteMesh(this.scene, meshName);

    if (mesh) {
      const data = new VertexData();
      data.colors = mesh.colors;
      data.normals = mesh.normals;
      data.positions = mesh.positions;

      const nodeMesh = this.createUnIndexedAlphaMesh(
        this.standardMaterial,
        this.actionManager,
        meshName,
      );
      data.applyToMesh(nodeMesh, false);
    }
  }

  disposeSceneAndRestartRendering(): void {
    if (this.scene) {
      this.scene.dispose();
    }

    if (this.canvas) {
      this.initialize(this.canvas);
      this.startRendering();
    }
  }

  private createScene(engine: Engine): Scene {
    // https://doc.babylonjs.com/how_to/optimizing_your_scene
    const scene = new Scene(engine, {
      useGeometryUniqueIdsMap: true,
      useClonedMeshMap: true,
    });

    // Make background of canvas transparent
    scene.clearColor = new Color4(0, 0, 0, 0);

    // An as transparent flagged mesh does not write to the depth buffer when rendering.
    // This can lead to potential artifacts.
    // https://forum.babylonjs.com/t/hasvertexalpha-causes-problems-when-unindexed-is-used-directly
    this.standardMaterial = new StandardMaterial('standardMaterial', scene);
    this.standardMaterial.forceDepthWrite = true;

    scene.freezeMaterials();

    // Used only as parent to have all nodes grouped together
    this.gridNode = new TransformNode('grid', scene);

    // To have `scene.onPointerMove` emitting
    this.actionManager = new ActionManager(scene);

    return scene;
  }

  private createCamera(scene: Scene): TargetCamera {
    const camera = this.cameraFactory.create(
      'camera',
      Math.PI / 2,
      Math.PI / 2,
      2,
      new Vector3(0, 0, 0),
      scene,
    );
    camera.inertia = 0;
    camera.panningInertia = 0;
    camera.wheelPrecision = 1.0;

    camera.panningSensibility = 10;
    camera.angularSensibilityX = 200;
    camera.angularSensibilityY = 100;

    camera.setPosition(new Vector3(20, 20, -20));

    this.attachCameraControl();

    return camera;
  }

  private attachCameraControl(): void {
    const renderingCanvas = this.engine?.getRenderingCanvas();
    if (renderingCanvas && this.camera) {
      this.camera.attachControl(renderingCanvas, true, false, 2);
    }
  }

  private detachCameraControl(): void {
    const renderingCanvas = this.engine?.getRenderingCanvas();
    if (renderingCanvas && this.camera) {
      this.camera.detachControl(renderingCanvas);
    }
  }

  private registerPointerEvents(scene: Scene): void {
    scene.onPointerPick = this.onPointerPick;
    scene.onPointerMove = this.onPointerMove;
  }

  private onPointerPick = (event: PointerEvent, pickInfo: PickingInfo): void => {
    const info = getPointerPickInfo(event, pickInfo);
    if (info) {
      this.pointerPickSubject$.next(info);
    }
  };

  private onPointerMove = (event: PointerEvent, pickInfo: PickingInfo): void => {
    const info = getPointerPickInfo(event, pickInfo);
    if (info) {
      this.pointUnderPointerSubject$.next(info);
    }
  };

  private createUnIndexedAlphaMesh(
    material: StandardMaterial,
    actionManager: ActionManager,
    name: string,
  ): Mesh {
    const mesh = new Mesh(name, this.scene, this.gridNode);

    // https://www.html5gamedevs.com/topic/31617-mesh-without-indices/?tab=comments#comment-181659
    // https://doc.babylonjs.com/how_to/optimizing_your_scene#using-unindexed-meshes
    mesh.isUnIndexed = true;

    // https://forum.babylonjs.com/t/hasvertexalpha-causes-problems-when-unindexed-is-used-directly
    mesh.hasVertexAlpha = true;
    mesh.material = material;

    // To have `scene.onPointerMove` emitting
    mesh.actionManager = actionManager;

    // https://doc.babylonjs.com/how_to/optimizing_your_scene
    // https://www.html5gamedevs.com/topic/12504-performancedraw-calls/
    mesh.freezeNormals();
    mesh.freezeWorldMatrix();

    return mesh;
  }
}

/**
 * PickingInfo.getNormal() requires to have indices which are not available
 * for an un-indexed custom mesh. Therefore, read normals directly from picked mesh.
 *
 * https://github.com/BabylonJS/Babylon.js/blob/master/src/Collisions/pickingInfo.ts#L65
 */
function getNormal(pickedMesh: AbstractMesh, faceId: number): Coord {
  const normals = pickedMesh.getVerticesData(VertexBuffer.NormalKind);

  if (!normals) {
    throw new Error('Could not get normals from picked mesh.');
  }

  const faceIndex = faceId * 9;

  return {
    x: normals[faceIndex],
    y: normals[faceIndex + 1],
    z: normals[faceIndex + 2],
  };
}

function getPointerPickInfo(
  event: PointerEvent,
  pickInfo: PickingInfo,
): UiPointerPickInfo | undefined {
  if (!pickInfo.pickedMesh || !pickInfo.pickedPoint) {
    return undefined;
  }

  return {
    pickedPoint: vector3ToCoord(pickInfo.pickedPoint),
    pointerButton: event.button,
    normal: getNormal(pickInfo.pickedMesh, pickInfo.faceId),
  };
}

function createLight(scene: Scene): Light {
  return new HemisphericLight('light', new Vector3(0, 1, -2), scene);
}

function vector3ToCoord(vector: Vector3): Coord {
  return {
    x: vector.x,
    y: vector.y,
    z: vector.z,
  };
}

function deleteMesh(scene: Scene, name: string): void {
  const oldMesh = scene.getMeshByName(name);

  if (oldMesh) {
    oldMesh.dispose();
  }
}

export function getMeshName(origin: Coord): string {
  return `node1 ${JSON.stringify(origin)}`;
}
