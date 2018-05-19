import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BoxGeometry, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';

@Component({
  selector: 'tls-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss'],
})
export class ViewportComponent implements AfterViewInit {
  @ViewChild('viewport') private viewportRef: ElementRef<HTMLDivElement>;

  private renderer: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;

  constructor() {}

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
    this.renderer.setSize(this.hostDimension.x, this.hostDimension.y);
    this.viewportRef.nativeElement.appendChild(this.renderer.domElement);
  }

  private animate() {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  }

  private get hostDimension(): Vector2 {
    const rect = this.viewportRef.nativeElement.getBoundingClientRect();
    return new Vector2(rect.width, rect.height);
  }
}
