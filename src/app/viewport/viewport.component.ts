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
    camera.setPosition(new Vector3(0, 0, 10));

    const light1: HemisphericLight = new HemisphericLight('light1', new Vector3(0, 1, 1), scene);

    const box: Mesh = MeshBuilder.CreateBox('box', { size: 1 }, scene);

    const customMesh = new Mesh('custom', scene);

    const positions = [-5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3];
    const indices = [0, 1, 2, 3, 4, 5];
    const vertexData = new VertexData();

    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.applyToMesh(customMesh);

    return scene;
  }

  // private createWorld(): World {
  //   const world = new World([3, 3, 3], [4, 4, 4]);
  //   world.setVoxel([0, 0, 0], new Voxel(1, 42));
  //   world.setVoxel([1, 1, 1], new Voxel(1, 42));
  //   world.setVoxel([2, 2, 2], new Voxel(1, 42));
  //   world.setVoxel([3, 3, 3], new Voxel(1, 42));
  //   world.setVoxel([4, 4, 4], new Voxel(1, 42));
  //
  //   const nextRandom = (max: number) => Math.floor(Math.random() * Math.floor(max));
  //   for (let i = 0; i < 100; i++) {
  //     const position: Vector3 = [
  //       nextRandom(3 * 4 - 1),
  //       nextRandom(3 * 4 - 1),
  //       nextRandom(3 * 4 - 1),
  //     ];
  //     world.setVoxel(position, new Voxel(1, 42));
  //   }
  //
  //   return world;
  // }
}
