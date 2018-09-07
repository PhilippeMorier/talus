import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Vector3,
  VertexData,
} from 'babylonjs';
import { getNaiveMesh } from '../mesher/naive-mesher';
import { Vector3 as Vec3 } from '../world/vector3';
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
      Vector3.Zero(),
      scene,
    );
    camera.attachControl(this.canvasRef.nativeElement, true, false, 2);
    camera.setPosition(new Vector3(0, 10, 35));

    const light1: HemisphericLight = new HemisphericLight('light1', new Vector3(0, 1, 1), scene);

    const customMesh = new Mesh('custom', scene);
    const vertexData = new VertexData();
    const meshData = getNaiveMesh(this.createWorld(), [0, 0, 0], [11, 11, 11]);
    vertexData.positions = meshData.positions;
    vertexData.indices = meshData.indices;
    vertexData.applyToMesh(customMesh);

    return scene;
  }

  private createWorld(): World {
    const world = new World([3, 3, 3], [4, 4, 4]);
    const maxIndex = 3 * 4 - 1;
    world.setVoxel([0, 0, 0], new Voxel(1, 42));
    world.setVoxel([maxIndex, 0, 0], new Voxel(1, 42));
    // world.setVoxel([0, 0, maxIndex], new Voxel(1, 42));
    // world.setVoxel([maxIndex, 0, maxIndex], new Voxel(1, 42));

    world.setVoxel([0, maxIndex, 0], new Voxel(1, 42));
    world.setVoxel([maxIndex, maxIndex, 0], new Voxel(1, 42));
    world.setVoxel([0, maxIndex, maxIndex], new Voxel(1, 42));
    world.setVoxel([maxIndex, maxIndex, maxIndex], new Voxel(1, 42));

    // const nextRandom = (max: number) => Math.floor(Math.random() * Math.floor(max));
    // for (let i = 0; i < 100; i++) {
    //   const position: Vec3 = [nextRandom(maxIndex), nextRandom(maxIndex), nextRandom(maxIndex)];
    //   world.setVoxel(position, new Voxel(1, 42));
    // }

    return world;
  }
}
