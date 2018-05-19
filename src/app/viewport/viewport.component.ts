import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';

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

  @ViewChild('canvas') private canvasRef: ElementRef;

  constructor(private componentRef: ElementRef) {
    this.component = componentRef.nativeElement as HTMLElement;
  }

  ngAfterViewInit() {
    this.createScene();
    this.animate();
  }

  private createScene(): void {
    const { x, y } = this.hostDimension;

    this.camera = new PerspectiveCamera(70, x / y, 0.01, 10);
    this.camera.position.z = 1;

    this.scene = new Scene();

    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const material = new MeshNormalMaterial();

    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);

    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(x, y);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  };

  private get hostDimension(): Vector2 {
    const rect = this.component.getBoundingClientRect();
    return new Vector2(rect.width, rect.height);
  }
}
