import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
// import '@babylonjs/core/Rendering/edgesRenderer';
// import '@babylonjs/core/Rendering/outlineRenderer';
import { select, Store } from '@ngrx/store';
import { rgbaToInt, Tool } from '@talus/model';
import {
  UiPointerButton,
  UiPointerPickInfo,
  UiSceneViewerComponent,
  UiSceneViewerService,
} from '@talus/ui';
import { areEqual, Coord, createMaxCoord, removeFraction } from '@talus/vdb';
import { combineLatest, Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import {
  paintVoxel,
  removeVoxel,
  setLineCoord,
  setVoxel,
  setVoxels,
  voxelUnderCursorChange,
} from './scene-viewer-container.actions';

@Component({
  selector: 'fe-scene-viewer-container',
  template: `
    <ui-scene-viewer
      *ngIf="selectedToolIdAndColor$ | async as selected"
      (pointerPick)="onPointerPick($event, selected[0], selected[1])"
      (pointUnderPointer)="onPointUnderPointer($event, selected[0], selected[1])"
    ></ui-scene-viewer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneViewerContainerComponent implements AfterViewInit {
  @ViewChild(UiSceneViewerComponent)
  private sceneViewerComponent: UiSceneViewerComponent;

  private selectedToolId$: Observable<Tool> = this.store.pipe(select(fromApp.selectSelectedToolId));
  private selectedColor$: Observable<number> = this.store.pipe(
    select(fromApp.selectSelectedIntColor),
  );
  selectedToolIdAndColor$ = combineLatest([this.selectedToolId$, this.selectedColor$]);

  private lastUnderPointerPosition: Coord = createMaxCoord();

  constructor(
    private sceneViewerService: UiSceneViewerService,
    private store: Store<fromApp.State>,
  ) {}

  ngAfterViewInit(): void {
    // Due to the status-bar being on the bottom of the screen a resizing is needed.
    this.sceneViewerService.resizeView();

    this.store.dispatch(setVoxel([0, 0, 0], rgbaToInt({ r: 0, g: 255, b: 0, a: 255 }), false));
  }

  onPointerPick(pickInfo: UiPointerPickInfo, selectedToolId: Tool, selectedColor: number): void {
    this.dispatchPickAction(pickInfo, selectedToolId, selectedColor);
  }

  onPointUnderPointer(
    pickInfo: UiPointerPickInfo,
    selectedToolId: Tool,
    selectedColor: number,
  ): void {
    if (selectedToolId === Tool.SelectLinePoint) {
      this.dispatchVoxelUnderCursorChange(pickInfo, selectedColor);
    }
  }

  private dispatchVoxelUnderCursorChange(pickInfo: UiPointerPickInfo, selectedColor: number): void {
    const toAddPosition = this.calcVoxelToAddPosition(pickInfo);
    const underPointerPosition = this.calcVoxelUnderPointerPosition(pickInfo);

    if (areEqual(this.lastUnderPointerPosition, underPointerPosition)) {
      return;
    }
    this.lastUnderPointerPosition = underPointerPosition;

    this.store.dispatch(
      voxelUnderCursorChange({
        toAddPosition,
        underPointerPosition,
        color: selectedColor,
      }),
    );
  }

  private initializeChessboard(position: Coord): void {
    const white = rgbaToInt({ r: 255, g: 255, b: 255, a: 255 });
    const grey = rgbaToInt({ r: 200, g: 200, b: 200, a: 255 });
    const coords: Coord[] = [];
    const newValues: number[] = [];

    const diameter = 8;
    for (let x = -diameter; x < diameter; x++) {
      for (let z = -diameter; z < diameter; z++) {
        coords.push([position[0] + x, position[1], position[2] + z]);
        newValues.push((x + z) % 2 === 0 ? white : grey);
      }
    }

    this.store.dispatch(setVoxels({ coords, newValues }));
  }

  private dispatchPickAction(
    pickInfo: UiPointerPickInfo,
    selectedToolId: Tool,
    newValue: number,
  ): void {
    if (pickInfo.pointerButton !== UiPointerButton.Main) {
      return;
    }

    switch (selectedToolId) {
      case Tool.SelectLinePoint:
        this.store.dispatch(setLineCoord({ xyz: this.calcVoxelToAddPosition(pickInfo), newValue }));
        break;
      case Tool.SetVoxel:
        this.store.dispatch(setVoxel(this.calcVoxelToAddPosition(pickInfo), newValue));
        break;
      case Tool.RemoveVoxel:
        this.store.dispatch(removeVoxel({ xyz: this.calcVoxelUnderPointerPosition(pickInfo) }));
        break;
      case Tool.PaintVoxel:
        this.store.dispatch(
          paintVoxel({ xyz: this.calcVoxelUnderPointerPosition(pickInfo), newValue }),
        );
        break;
    }
  }

  private calcVoxelToAddPosition(pickInfo: UiPointerPickInfo): Coord {
    const pickedIntegerPoint = this.roundDimensionAlongNormal(pickInfo);

    // VDB removes fractional-part of the coordinate, i.e. 0.54 -> 0.
    // Therefore, positive numbers are getting rounded down (1.9 -> 1) and
    // negative numbers are getting rounded up (-0.2 -> 0).
    // Hence, the subtraction of 1 is needed.
    const newPoint: Coord = [
      pickInfo.normal[0] < 0 || (pickInfo.normal[0] === 0 && pickedIntegerPoint[0] < 0)
        ? pickedIntegerPoint[0] - 1
        : pickedIntegerPoint[0],
      pickInfo.normal[1] < 0 || (pickInfo.normal[1] === 0 && pickedIntegerPoint[1] < 0)
        ? pickedIntegerPoint[1] - 1
        : pickedIntegerPoint[1],
      pickInfo.normal[2] < 0 || (pickInfo.normal[2] === 0 && pickedIntegerPoint[2] < 0)
        ? pickedIntegerPoint[2] - 1
        : pickedIntegerPoint[2],
    ];

    removeFraction(newPoint);

    return newPoint;
  }

  private calcVoxelUnderPointerPosition(pickInfo: UiPointerPickInfo): Coord {
    const pickedIntegerPoint = this.roundDimensionAlongNormal(pickInfo);

    const newPoint: Coord = [
      pickInfo.normal[0] > 0 || (pickInfo.normal[0] === 0 && pickedIntegerPoint[0] < 0)
        ? pickedIntegerPoint[0] - 1
        : pickedIntegerPoint[0],
      pickInfo.normal[1] > 0 || (pickInfo.normal[1] === 0 && pickedIntegerPoint[1] < 0)
        ? pickedIntegerPoint[1] - 1
        : pickedIntegerPoint[1],
      pickInfo.normal[2] > 0 || (pickInfo.normal[2] === 0 && pickedIntegerPoint[2] < 0)
        ? pickedIntegerPoint[2] - 1
        : pickedIntegerPoint[2],
    ];

    removeFraction(newPoint);

    return newPoint;
  }

  /**
   * Babylon.js returns sometimes a floating instead of integer number for the dimension of
   * the normal vector of the picked point.
   * E.g. Click on [1, 0.5, 0.6] on voxel at [0, 0, 0] on its site which has the x-axis as its
   * normal vector [1, 0, 0], could result in a picking point of something like [0.99999, 0.5, 0.6].
   * Where in fact it should be [1, 0.5, 0.6].
   * Since all the voxels are placed on integer positions the dimension of the picked point
   * needs to be rounded.
   */
  private roundDimensionAlongNormal(pickInfo: UiPointerPickInfo): Coord {
    return [
      pickInfo.normal[0] !== 0 ? Math.round(pickInfo.pickedPoint[0]) : pickInfo.pickedPoint[0],
      pickInfo.normal[1] !== 0 ? Math.round(pickInfo.pickedPoint[1]) : pickInfo.pickedPoint[1],
      pickInfo.normal[2] !== 0 ? Math.round(pickInfo.pickedPoint[2]) : pickInfo.pickedPoint[2],
    ];
  }
}
