import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ui-scene-viewer',
  template: `
    <canvas #canvas></canvas>
  `,
  styleUrls: ['./scene-viewer.component.scss'],
})
export class SceneViewerComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  constructor() {}

  ngOnInit(): void {}
}
