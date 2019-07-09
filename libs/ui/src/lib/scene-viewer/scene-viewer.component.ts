import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SceneViewerService } from './scene-viewer.service';

@Component({
  selector: 'ui-scene-viewer',
  template: `
    <canvas #canvas></canvas>
  `,
  styleUrls: ['./scene-viewer.component.scss'],
})
export class SceneViewerComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  constructor(private sceneViewerService: SceneViewerService) {}

  ngOnInit(): void {
    this.sceneViewerService.initialize(this.canvas.nativeElement);
    this.sceneViewerService.startRendering();
  }

  ngOnDestroy(): void {
    this.sceneViewerService.destroy();
  }
}
