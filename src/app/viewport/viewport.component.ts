import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  BoxGeometry,
  Clock,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { FirstPersonControls } from '../FirstPersonControls';

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
    this.camera.position.z = 10;

    this.controls = new FirstPersonControls(this.camera, this.canvasRef.nativeElement);
    this.controls.lookSpeed = 0.4;
    this.controls.movementSpeed = 10;
    this.controls.lookVertical = true;
    this.controls.constrainVertical = true;
    this.controls.verticalMin = 1.0;
    this.controls.verticalMax = 2.0;

    this.scene = new Scene();

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial();

    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);

    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(x, y);
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
}
