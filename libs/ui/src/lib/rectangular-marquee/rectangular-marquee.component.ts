import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ui-rectangular-marquee',
  template: `
    <div id="rectangle" #rectangle></div>

    <div
      *ngFor="let i of [0, 1, 2, 3]"
      id="{{ 'gizmo' + i }}"
      class="mat-elevation-z2"
      cdkDrag
      (cdkDragStarted)="onStarted(i)"
      (cdkDragMoved)="onMoved(i, $event)"
      (cdkDragEnded)="onEnded(i, $event)"
      [cdkDragFreeDragPosition]="gizmoCurrentFreeDragPositions[i]"
    ></div>
  `,
  styleUrls: ['./rectangular-marquee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiRectangularMarqueeComponent implements OnInit, AfterViewInit {
  @ViewChild('rectangle') rectangle?: ElementRef<HTMLDivElement>;

  public gizmoCurrentFreeDragPositions: { x: number; y: number }[] = [];

  private gizmoTotalFreeDragPositions: { x: number; y: number }[] = [];
  private gizmoOnSameXIndex = -1;
  private gizmoOnSameYIndex = -1;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Ensure that all gizmos have different positions
    this.gizmoTotalFreeDragPositions = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    this.gizmoCurrentFreeDragPositions = [...this.gizmoTotalFreeDragPositions];
  }

  ngAfterViewInit(): void {
    this.updateRectangle();
  }

  onStarted(gizmoIndex: number): void {
    this.gizmoOnSameXIndex = this.gizmoTotalFreeDragPositions.findIndex(
      pos =>
        pos !== this.gizmoTotalFreeDragPositions[gizmoIndex] &&
        pos.x === this.gizmoTotalFreeDragPositions[gizmoIndex].x,
    );
    this.gizmoOnSameYIndex = this.gizmoTotalFreeDragPositions.findIndex(
      pos =>
        pos !== this.gizmoTotalFreeDragPositions[gizmoIndex] &&
        pos.y === this.gizmoTotalFreeDragPositions[gizmoIndex].y,
    );
  }

  onMoved(gizmoIndex: number, moveEvent: CdkDragMove<void>): void {
    this.gizmoCurrentFreeDragPositions[gizmoIndex] = {
      x: this.gizmoTotalFreeDragPositions[gizmoIndex].x + moveEvent.distance.x,
      y: this.gizmoTotalFreeDragPositions[gizmoIndex].y + moveEvent.distance.y,
    };

    if (this.gizmoOnSameXIndex > -1) {
      this.gizmoCurrentFreeDragPositions[this.gizmoOnSameXIndex] = {
        ...this.gizmoTotalFreeDragPositions[this.gizmoOnSameXIndex],
        x: this.gizmoTotalFreeDragPositions[gizmoIndex].x + moveEvent.distance.x,
      };
    }

    if (this.gizmoOnSameYIndex > -1) {
      this.gizmoCurrentFreeDragPositions[this.gizmoOnSameYIndex] = {
        ...this.gizmoTotalFreeDragPositions[this.gizmoOnSameYIndex],
        y: this.gizmoTotalFreeDragPositions[gizmoIndex].y + moveEvent.distance.y,
      };
    }

    this.updateRectangle();
  }

  onEnded(gizmoIndex: number, endEvent: CdkDragEnd): void {
    this.gizmoTotalFreeDragPositions[gizmoIndex] = {
      x: this.gizmoTotalFreeDragPositions[gizmoIndex].x + endEvent.distance.x,
      y: this.gizmoTotalFreeDragPositions[gizmoIndex].y + endEvent.distance.y,
    };

    if (this.gizmoOnSameXIndex > -1) {
      this.gizmoTotalFreeDragPositions[this.gizmoOnSameXIndex] = {
        ...this.gizmoTotalFreeDragPositions[this.gizmoOnSameXIndex],
        x: this.gizmoTotalFreeDragPositions[this.gizmoOnSameXIndex].x + endEvent.distance.x,
      };
    }

    if (this.gizmoOnSameYIndex > -1) {
      this.gizmoTotalFreeDragPositions[this.gizmoOnSameYIndex] = {
        ...this.gizmoTotalFreeDragPositions[this.gizmoOnSameYIndex],
        y: this.gizmoTotalFreeDragPositions[this.gizmoOnSameYIndex].y + endEvent.distance.y,
      };
    }
  }

  private updateRectangle(): void {
    if (!this.rectangle) {
      throw new Error('Rectangle is unavailable.');
    }

    const minX = Math.min(...this.gizmoCurrentFreeDragPositions.map(({ x }) => x));
    const minY = Math.min(...this.gizmoCurrentFreeDragPositions.map(({ y }) => y));
    const maxX = Math.max(...this.gizmoCurrentFreeDragPositions.map(({ x }) => x));
    const maxY = Math.max(...this.gizmoCurrentFreeDragPositions.map(({ y }) => y));

    const gizmoRadius = 5;
    this.setPosition(this.rectangle.nativeElement, minX + gizmoRadius, minY + gizmoRadius);
    this.setSize(this.rectangle.nativeElement, maxX - minX, maxY - minY);
  }

  private setPosition(element: HTMLElement, left: number, top: number): void {
    this.renderer.setStyle(element, 'left', `${left}px`);
    this.renderer.setStyle(element, 'top', `${top}px`);
  }

  private setSize(element: HTMLElement, width: number, height: number): void {
    this.renderer.setStyle(element, 'width', `${width}px`);
    this.renderer.setStyle(element, 'height', `${height}px`);
  }
}
