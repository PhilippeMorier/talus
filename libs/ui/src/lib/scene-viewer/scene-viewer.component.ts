import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UiSceneViewerService } from './scene-viewer.service';

@Component({
  selector: 'ui-scene-viewer',
  template: `
    <canvas #canvas (dragover)="onDragOver($event)" (drop)="onDrop($event)"></canvas>
  `,
  styleUrls: ['./scene-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSceneViewerComponent implements OnInit {
  constructor(private sceneViewerService: UiSceneViewerService) {}

  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;

  @Output() pointerPick = this.sceneViewerService.pointerPick$;
  @Output() pointUnderPointer = this.sceneViewerService.pointUnderPointer$;

  @Output() dropFiles = new EventEmitter<File[]>();

  ngOnInit(): void {
    if (!this.canvas) {
      throw new Error('Could not found canvas.');
    }

    this.sceneViewerService.initialize(this.canvas.nativeElement);
    this.sceneViewerService.startRendering();
  }

  @HostListener('window:resize')
  onWindowsResize(): void {
    this.sceneViewerService.resizeView();
  }

  onDragOver(event: DragEvent): void {
    // Prevent file from being opened
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    // Prevent file from being opened
    event.preventDefault();

    this.dropFiles.emit(getFiles(event));
  }
}

/**
 * Source: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
 */
function getFiles(event: DragEvent): File[] {
  return event.dataTransfer && event.dataTransfer.items
    ? getFilesFromDataTransferItemList(event)
    : getFilesFromDataTransfer(event);
}

function getFilesFromDataTransferItemList(event: DragEvent): File[] {
  const files: File[] = [];

  if (!event.dataTransfer) {
    return files;
  }

  // Use DataTransferItemList interface to access the file(s)
  for (let i = 0; i < event.dataTransfer.items.length; i++) {
    // If dropped items aren't files, reject them
    if (event.dataTransfer.items[i].kind === 'file') {
      const file = event.dataTransfer.items[i].getAsFile();

      if (file) {
        files.push(file);
      }
    }
  }

  return files;
}

function getFilesFromDataTransfer(event: DragEvent): File[] {
  const files: File[] = [];

  if (!event.dataTransfer) {
    return files;
  }

  // Use DataTransfer interface to access the file(s)
  for (let i = 0; i < event.dataTransfer.files.length; i++) {
    files.push(event.dataTransfer.files[i]);
  }

  return files;
}
