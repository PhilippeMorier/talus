import { AfterViewInit, Component, ElementRef } from '@angular/core';
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

  constructor(private componentRef: ElementRef) {
    this.component = componentRef.nativeElement as HTMLElement;
  }

  ngAfterViewInit() {
    this.createScene();
    this.animate();
  }

  private createScene(): void {
    this.camera = new PerspectiveCamera(70, this.hostDimension.x / this.hostDimension.y, 0.01, 10);
    this.camera.position.z = 1;

    this.scene = new Scene();

    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const material = new MeshNormalMaterial();

    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);

    this.renderer = new WebGLRenderer({ antialias: true });
    const { x, y } = this.hostDimension;
    console.log(this.hostDimension);
    this.renderer.setSize(x, y);

    this.component.appendChild(this.renderer.domElement);
  }

  private animate() {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  }

  private get hostDimension(): Vector2 {
    const rect = this.component.getBoundingClientRect();
    return new Vector2(rect.width, rect.height);
  }
}
