import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  AxesHelper,
  BufferGeometry,
  Clock,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { FirstPersonControls } from '../FirstPersonControls';
import { Voxel, World } from '../world/world';
import { getNaiveMesh } from '../mesher/naive-mesher';

@Component({
  selector: 'tls-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements AfterViewInit {
  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private component: HTMLElement;
  private controls: FirstPersonControls;
  private clock = new Clock(true);

  @ViewChild('canvas') private canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(private componentRef: ElementRef) {
    this.component = componentRef.nativeElement as HTMLElement;
  }

  ngAfterViewInit() {
    this.createScene();
    this.animate();
  }

  private createScene(): void {
    const { x, y } = this.hostDimension;

    this.camera = new PerspectiveCamera(70, x / y, 0.1, 1000);
    this.camera.position.z = 1;
    this.setupCameraControls();

    const world = this.createWorld();
    const vertices = getNaiveMesh(world, 1, [0, 0, 0], [4, 4, 4]);

    const geometry = new BufferGeometry();
    geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    material.wireframe = true;
    const mesh = new Mesh(geometry, material);

    this.scene = new Scene();
    this.scene.add(new AxesHelper(10));
    this.scene.add(mesh);

    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(x, y);
  }

  private setupCameraControls() {
    this.controls = new FirstPersonControls(this.camera, this.canvasRef.nativeElement);
    this.controls.lookSpeed = 0.4;
    this.controls.movementSpeed = 10;
    this.controls.lookVertical = true;
    this.controls.constrainVertical = true;
    this.controls.verticalMin = 1.0;
    this.controls.verticalMax = 2.0;
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    this.controls.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
  };

  private get hostDimension(): Vector2 {
    const rect = this.component.getBoundingClientRect();
    return new Vector2(rect.width, rect.height);
  }

  private createWorld(): World {
    const world = new World([3, 3, 3], [4, 4, 4]);
    world.setVoxel([0, 0, 0], new Voxel(1, 42));
    world.setVoxel([1, 1, 1], new Voxel(1, 42));
    world.setVoxel([2, 2, 2], new Voxel(1, 42));
    world.setVoxel([3, 3, 3], new Voxel(1, 42));
    world.setVoxel([4, 4, 4], new Voxel(1, 42));

    return world;
  }
}
