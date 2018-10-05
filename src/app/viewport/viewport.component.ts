import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  Mesh,
  Scene,
  StandardMaterial,
  Vector3,
  VertexData,
} from 'babylonjs';
import { getNaiveMesh } from '../mesher/naive-mesher';
import { BunnyPoints, convertIntoRange } from '../world/bunny';
import { Vector3 as Vec3, X, Y, Z } from '../world/vector3';
import { Voxel, World } from '../world/world';

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

    const world = new World([64, 64, 64], [16, 16, 16]);
    BunnyPoints.forEach(p => {
      const position: Vec3 = [
        convertIntoRange(p[X]),
        convertIntoRange(p[Y]),
        convertIntoRange(p[Z]),
      ];
      world.setVoxelByAbsolutePosition(position, new Voxel(1, 42));
    });

    const material = new StandardMaterial('material', scene);

    let chunkCount = 0;
    for (let x = 0; x < world.size[X]; x++) {
      for (let y = 0; y < world.size[Y]; y++) {
        for (let z = 0; z < world.size[Z]; z++) {
          const chunk = world.chunks[x][y][z];
          if (chunk) {
            chunkCount++;

            const customMesh = new Mesh(`${x},${y},${z}`, scene);
            customMesh.material = material;
            const vertexData = new VertexData();
            const { colors, indices, positions } = getNaiveMesh(chunk);

            vertexData.positions = positions;
            vertexData.indices = indices;
            vertexData.colors = colors;
            vertexData.applyToMesh(customMesh);
          }
        }
      }
    }

    console.log('chunkCount', chunkCount);

    return scene;
  }
}
