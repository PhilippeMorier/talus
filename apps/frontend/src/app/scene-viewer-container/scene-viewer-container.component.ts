import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
// import '@babylonjs/core/Rendering/edgesRenderer';
// import '@babylonjs/core/Rendering/outlineRenderer';
import { Store, select } from '@ngrx/store';
import { Tool, rgbaToInt } from '@talus/model';
import {
  UiFullscreenOverlayService,
  UiPointerButton,
  UiPointerPickInfo,
  UiSceneViewerService,
} from '@talus/ui';
import { Coord, areEqual, createMaxCoord, removeFraction } from '@talus/vdb';
import { Observable, combineLatest } from 'rxjs';
import * as fromApp from '../app.reducer';
import { LoadFileContainerComponent } from './load-file-container/load-file-container.component';
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
      (dropFiles)="onDropFiles($event)"
    ></ui-scene-viewer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneViewerContainerComponent implements AfterViewInit {
  private selectedToolId$: Observable<Tool> = this.store.pipe(select(fromApp.selectSelectedToolId));
  private selectedColor$: Observable<number> = this.store.pipe(
    select(fromApp.selectSelectedIntColor),
  );
  selectedToolIdAndColor$ = combineLatest([this.selectedToolId$, this.selectedColor$]);

  private lastUnderPointerPosition: Coord = createMaxCoord();

  constructor(
    private readonly fullscreenOverlayService: UiFullscreenOverlayService,
    private readonly sceneViewerService: UiSceneViewerService,
    private readonly store: Store<fromApp.State>,
  ) {}

  ngAfterViewInit(): void {
    // Due to the status-bar being on the bottom of the screen a resizing is needed.
    this.sceneViewerService.resizeView();

    this.store.dispatch(
      setVoxel({ xyz: { x: 0, y: 0, z: 0 }, newValue: rgbaToInt({ r: 0, g: 255, b: 0, a: 255 }) }),
    );
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

  onDropFiles(files: File[]): void {
    if (files.length < 1) {
      return;
    }

    // Can't dispatch action with `File` since it would be an unserializable action.
    // Therefore, opening the dialog here and not in an effect.
    this.fullscreenOverlayService.open(LoadFileContainerComponent, files[0]);
  }

  private dispatchVoxelUnderCursorChange(pickInfo: UiPointerPickInfo, selectedColor: number): void {
    const toAddPosition = calcVoxelToAddPosition(pickInfo);
    const underPointerPosition = calcVoxelUnderPointerPosition(pickInfo);

    if (areEqual(this.lastUnderPointerPosition, underPointerPosition)) {
      return;
    }
    this.lastUnderPointerPosition = underPointerPosition;

    this.store.dispatch(
      voxelUnderCursorChange({
        toAddPosition,
        underPointerPosition,
        color: selectedColor,
        needsSync: true,
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
        coords.push({ x: position.x + x, y: position.y, z: position.z + z });
        newValues.push((x + z) % 2 === 0 ? white : grey);
      }
    }

    this.store.dispatch(setVoxels({ coords, newValues, needsSync: true }));
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
        this.store.dispatch(
          setLineCoord({ xyz: calcVoxelToAddPosition(pickInfo), newValue, needsSync: true }),
        );
        break;
      case Tool.SetVoxel:
        this.store.dispatch(
          setVoxel({ xyz: calcVoxelToAddPosition(pickInfo), newValue, needsSync: true }),
        );
        break;
      case Tool.RemoveVoxel:
        this.store.dispatch(
          removeVoxel({ xyz: calcVoxelUnderPointerPosition(pickInfo), needsSync: true }),
        );
        break;
      case Tool.PaintVoxel:
        this.store.dispatch(
          paintVoxel({
            xyz: calcVoxelUnderPointerPosition(pickInfo),
            newValue,
            needsSync: true,
          }),
        );
        break;
    }
  }
}

function calcVoxelToAddPosition(pickInfo: UiPointerPickInfo): Coord {
  const pickedIntegerPoint = roundDimensionAlongNormal(pickInfo);

  // VDB removes fractional-part of the coordinate, i.e. 0.54 -> 0.
  // Therefore, positive numbers are getting rounded down (1.9 -> 1) and
  // negative numbers are getting rounded up (-0.2 -> 0).
  // Hence, the subtraction of 1 is needed.
  const newPoint: Coord = {
    x:
      pickInfo.normal.x < 0 || (pickInfo.normal.x === 0 && pickedIntegerPoint.x < 0)
        ? pickedIntegerPoint.x - 1
        : pickedIntegerPoint.x,
    y:
      pickInfo.normal.y < 0 || (pickInfo.normal.y === 0 && pickedIntegerPoint.y < 0)
        ? pickedIntegerPoint.y - 1
        : pickedIntegerPoint.y,
    z:
      pickInfo.normal.z < 0 || (pickInfo.normal.z === 0 && pickedIntegerPoint.z < 0)
        ? pickedIntegerPoint.z - 1
        : pickedIntegerPoint.z,
  };

  removeFraction(newPoint);

  return newPoint;
}

function calcVoxelUnderPointerPosition(pickInfo: UiPointerPickInfo): Coord {
  const pickedIntegerPoint = roundDimensionAlongNormal(pickInfo);

  const newPoint: Coord = {
    x:
      pickInfo.normal.x > 0 || (pickInfo.normal.x === 0 && pickedIntegerPoint.x < 0)
        ? pickedIntegerPoint.x - 1
        : pickedIntegerPoint.x,
    y:
      pickInfo.normal.y > 0 || (pickInfo.normal.y === 0 && pickedIntegerPoint.y < 0)
        ? pickedIntegerPoint.y - 1
        : pickedIntegerPoint.y,
    z:
      pickInfo.normal.z > 0 || (pickInfo.normal.z === 0 && pickedIntegerPoint.z < 0)
        ? pickedIntegerPoint.z - 1
        : pickedIntegerPoint.z,
  };

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
function roundDimensionAlongNormal(pickInfo: UiPointerPickInfo): Coord {
  return {
    x: pickInfo.normal.x !== 0 ? Math.round(pickInfo.pickedPoint.x) : pickInfo.pickedPoint.x,
    y: pickInfo.normal.y !== 0 ? Math.round(pickInfo.pickedPoint.y) : pickInfo.pickedPoint.y,
    z: pickInfo.normal.z !== 0 ? Math.round(pickInfo.pickedPoint.z) : pickInfo.pickedPoint.z,
  };
}
