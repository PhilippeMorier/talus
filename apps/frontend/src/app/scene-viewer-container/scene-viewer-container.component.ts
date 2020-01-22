import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
// import '@babylonjs/core/Rendering/edgesRenderer';
// import '@babylonjs/core/Rendering/outlineRenderer';
import { select, Store } from '@ngrx/store';
import {
  UiColorDialogColor,
  UiPointerButton,
  UiPointerPickInfo,
  UiSceneViewerComponent,
} from '@talus/ui';
import { Coord } from '@talus/vdb';
import { combineLatest, Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Tool } from '../tools-panel/tool.model';
import { paintVoxel, removeVoxel, setVoxel } from './scene-viewer-container.actions';

@Component({
  selector: 'fe-scene-viewer-container',
  template: `
    <ui-scene-viewer
      *ngIf="selectedToolIdAndColor$ | async as selected"
      (pointerPick)="onPointerPick($event, selected[0], selected[1])"
    ></ui-scene-viewer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneViewerContainerComponent implements AfterViewInit {
  @ViewChild(UiSceneViewerComponent, { static: false })
  private sceneViewerComponent: UiSceneViewerComponent;

  private selectedToolId$: Observable<Tool> = this.store.pipe(select(fromApp.selectSelectedToolId));
  private selectedColor$: Observable<UiColorDialogColor> = this.store.pipe(
    select(fromApp.selectSelectedColor),
  );
  selectedToolIdAndColor$ = combineLatest([this.selectedToolId$, this.selectedColor$]);

  constructor(private store: Store<fromApp.State>) {}

  ngAfterViewInit(): void {
    this.store.dispatch(setVoxel({ xyz: [0, 0, 0], newValue: 42 }));
  }

  onPointerPick(
    event: UiPointerPickInfo,
    selectedToolId: Tool,
    selectedColor: UiColorDialogColor,
  ): void {
    this.dispatchPickAction(event, selectedToolId, selectedColor);
  }

  // onMeshPick(mesh: AbstractMesh): void {
  //   mesh.edgesRenderer ? mesh.disableEdgesRendering() : mesh.enableEdgesRendering();
  //   mesh.renderOutline = !mesh.renderOutline;
  // }

  private dispatchPickAction(
    pickInfo: UiPointerPickInfo,
    selectedToolId: Tool,
    selectedColor: UiColorDialogColor,
  ): void {
    if (pickInfo.pointerButton !== UiPointerButton.Main) {
      return;
    }

    switch (selectedToolId) {
      case Tool.SetVoxel:
        this.store.dispatch(
          setVoxel({ xyz: this.calcVoxelToAddPosition(pickInfo), newValue: selectedColor.r }),
        );
        break;
      case Tool.RemoveVoxel:
        this.store.dispatch(removeVoxel({ xyz: this.calcClickedVoxelPosition(pickInfo) }));
        break;
      case Tool.PaintVoxel:
        this.store.dispatch(
          paintVoxel({ xyz: this.calcClickedVoxelPosition(pickInfo), newValue: selectedColor.r }),
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

    return newPoint;
  }

  private calcClickedVoxelPosition(pickInfo: UiPointerPickInfo): Coord {
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
