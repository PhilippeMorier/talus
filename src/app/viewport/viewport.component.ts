import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  ArcRotateCamera,
  Engine,
  EventState,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PointerEventTypes,
  PointerInfo,
  Scene,
  Vector3,
  VertexData,
} from 'babylonjs';
import { getNaiveMeshData } from '../mesher/naive-mesher';
import { BunnyPoints, convertIntoRange } from '../world/bunny';
import { Chunk } from '../world/chunk';
import { Vector3 as Vec3, X, Y, Z } from '../world/vector3';
import { Voxel } from '../world/voxel';
import { World } from '../world/world';

@Component({
  selector: 'tls-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements AfterViewInit {
  private engine: Engine;
  private scene: Scene;

  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.engine = new Engine(this.canvasRef.nativeElement, true);

    this.scene = this.createScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  addChunkToScene(chunk: Chunk, scene: Scene): void {
    const { colors, indices, positions } = getNaiveMeshData(chunk);

    const normals = [];
    VertexData.ComputeNormals(positions, indices, normals);

    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.colors = colors;
    vertexData.normals = normals;

    const chunkMesh = new Mesh(chunk.name, scene);
    vertexData.applyToMesh(chunkMesh);
    chunkMesh.convertToFlatShadedMesh();
  }

  private createScene(): Scene {
    const scene: Scene = new Scene(this.engine);

    const camera: ArcRotateCamera = new ArcRotateCamera(
      'Camera',
      Math.PI / 2,
      Math.PI / 2,
      2,
      new Vector3(0, 0, 0),
      scene,
    );
    camera.attachControl(this.canvasRef.nativeElement, true, false, 2);
    // camera.setPosition(new Vector3(0, 0, 35));
    camera.setPosition(new Vector3(256, 256, 256));
    camera.panningSensibility = 10;

    const light1: HemisphericLight = new HemisphericLight('light1', new Vector3(0, 1, 1), scene);

    const world = new World([32, 32, 32], [16, 16, 16]);
    BunnyPoints.forEach(p => {
      const position: Vec3 = [
        convertIntoRange(p[X]),
        convertIntoRange(p[Y]),
        convertIntoRange(p[Z]),
      ];
      world.setVoxelByAbsolutePosition(position, new Voxel(1, 42));
    });

    const chunkCount = 0;
    for (let x = 0; x < world.size[X]; x++) {
      for (let y = 0; y < world.size[Y]; y++) {
        for (let z = 0; z < world.size[Z]; z++) {
          const chunk = world.chunks[x][y][z];
          if (chunk) {
            this.addChunkToScene(chunk, scene);
          }
        }
      }
    }

    scene.onPointerObservable.add((pointer: PointerInfo, state: EventState) => {
      if (!pointer.pickInfo.hit) {
        return;
      }

      if (pointer.type === PointerEventTypes.POINTERUP) {
        const normal = pointer.pickInfo.getNormal();
        const point = pointer.pickInfo.pickedPoint;
        console.log('normal', normal);

        // get clicked voxel
        // chunkBoundingBox.position = new Vector3(
        //   (point.x | 0) - (normal.x > 0 ? 1 : 0),
        //   (point.y | 0) - (normal.y > 0 ? 1 : 0),
        //   (point.z | 0) - (normal.z > 0 ? 1 : 0),
        // );

        // get neighbor voxel
        const x = (point.x | 0) + (normal.x < 0 ? -1 : 0);
        const y = (point.y | 0) + (normal.y < 0 ? -1 : 0);
        const z = (point.z | 0) + (normal.z < 0 ? -1 : 0);

        const updatedChunk = world.setVoxelByAbsolutePosition([x, y, z], new Voxel(1, 42));
        this.addChunkToScene(updatedChunk, scene);
        if (updatedChunk.name === pointer.pickInfo.pickedMesh.name) {
          scene.removeMesh(pointer.pickInfo.pickedMesh);
        }
      } else if (pointer.type === PointerEventTypes.POINTERUP) {
        pointer.pickInfo.pickedMesh.showBoundingBox = false;
      }
    });

    return scene;
  }
}
