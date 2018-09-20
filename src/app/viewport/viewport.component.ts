import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  Mesh,
  Scene,
  Vector3,
  VertexData,
} from 'babylonjs';
import { getNaiveMesh } from '../mesher/naive-mesher';
import { Chunk } from '../world/chunk';
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
    camera.setPosition(new Vector3(0, 0, 35));

    const light1: HemisphericLight = new HemisphericLight('light1', new Vector3(0, 1, 1), scene);

    const customMesh = new Mesh('custom', scene);
    const vertexData = new VertexData();

    const chunk = new Chunk([4, 4, 4]);
    chunk.voxels[0][0][0] = new Voxel(1, 42);
    chunk.voxels[3][3][3] = new Voxel(1, 42);
    const meshData = getNaiveMesh(chunk);

    vertexData.positions = meshData.positions;
    vertexData.indices = meshData.indices;
    vertexData.applyToMesh(customMesh);

    return scene;
  }
}
