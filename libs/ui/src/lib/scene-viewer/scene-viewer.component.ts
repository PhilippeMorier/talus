import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SceneViewerService } from './scene-viewer.service';

@Component({
  selector: 'ui-scene-viewer',
  template: `
    <canvas #canvas></canvas>
  `,
  styleUrls: ['./scene-viewer.component.scss'],
  providers: [SceneViewerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneViewerComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  @Output() pointerPick = this.sceneViewerService.pointerPick$;
  @Output() meshPick = this.sceneViewerService.meshPick$;

  constructor(private sceneViewerService: SceneViewerService) {}

  @HostListener('window:resize')
  onWindowsResize(): void {
    this.sceneViewerService.resizeView();
  }

  ngOnInit(): void {
    this.sceneViewerService.initialize(this.canvas.nativeElement);
    this.sceneViewerService.startRendering();
  }
}
