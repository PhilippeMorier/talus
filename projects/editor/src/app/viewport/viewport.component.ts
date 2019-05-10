import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PointerEventTypes, PointerInfo } from '@babylonjs/core/Events/pointerEvents';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { Scene } from '@babylonjs/core/scene';
import { getNaiveMeshData } from '../mesher/naive-mesher';
import { SceneService } from '../scene.service';
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
  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private sceneService: SceneService) {}

  ngAfterViewInit(): void {
    this.sceneService.initialize(this.canvasRef.nativeElement);
    this.loadData();
    this.sceneService.startRendering();
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

  private loadData(): void {
    const world = new World([32, 32, 32], [16, 16, 16]);
    BunnyPoints.forEach(p => {
      const position: Vec3 = [
        convertIntoRange(p[X]),
        convertIntoRange(p[Y]),
        convertIntoRange(p[Z]),
      ];
      world.setVoxelByAbsolutePosition(position, new Voxel(1, 42));
    });

    for (let x = 0; x < world.size[X]; x++) {
      for (let y = 0; y < world.size[Y]; y++) {
        for (let z = 0; z < world.size[Z]; z++) {
          const chunk = world.chunks[x][y][z];
          if (chunk) {
            this.addChunkToScene(chunk, this.sceneService.scene);
          }
        }
      }
    }

    // You were thinking about where do we dispatch the action for adding a voxel
    // Do we need to put the whole world (all voxels) into the state? I think yes.
    // dispatch(addVoxel) -> dispatch(generateMeshStart) -> dispatch(generateMeshSuccessful)
    // -> dispatch(addMesh) -> dispatch(removeOldMesh)
    this.sceneService.scene.onPointerObservable.add((pointer: PointerInfo) => {
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

        // tslint:disable: no-bitwise
        // get neighbour voxel
        const x = (point.x | 0) + (normal.x < 0 ? -1 : 0);
        const y = (point.y | 0) + (normal.y < 0 ? -1 : 0);
        const z = (point.z | 0) + (normal.z < 0 ? -1 : 0);
        // tslint:enable: no-bitwise

        const updatedChunk = world.setVoxelByAbsolutePosition([x, y, z], new Voxel(1, 42));
        this.addChunkToScene(updatedChunk, this.sceneService.scene);
        if (updatedChunk.name === pointer.pickInfo.pickedMesh.name) {
          this.sceneService.scene.removeMesh(pointer.pickInfo.pickedMesh);
        }
      }
      // else if (pointer.type === PointerEventTypes.POINTERUP) {
      // pointer.pickInfo.pickedMesh.showBoundingBox = false;
      // }
    });
  }
}
