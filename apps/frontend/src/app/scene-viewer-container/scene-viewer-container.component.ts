import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
// import '@babylonjs/core/Rendering/edgesRenderer';
// import '@babylonjs/core/Rendering/outlineRenderer';
import { select, Store } from '@ngrx/store';
import { PointerButton, PointerPickInfo, SceneViewerComponent } from '@talus/ui';
import { add, Coord } from '@talus/vdb';
import { Observable } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Tool } from '../tools-panel/tool.model';
import { addVoxel, removeVoxel } from './scene-viewer-container.actions';

@Component({
  selector: 'fe-scene-viewer-container',
  template: `
    <ui-scene-viewer
      *ngIf="selectedToolId$ | async as selectedToolId"
      (pointerPick)="onPointerPick($event, selectedToolId)"
    ></ui-scene-viewer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneViewerContainerComponent {
  @ViewChild(SceneViewerComponent, { static: false })
  private sceneViewerComponent: SceneViewerComponent;

  selectedToolId$: Observable<Tool> = this.store.pipe(select(fromApp.selectSelectedToolId));
  voxelCount$: Observable<number> = this.store.pipe(select(fromApp.selectVoxelCount));

  constructor(private store: Store<fromApp.State>) {}

  onPointerPick(event: PointerPickInfo, selectedToolId: Tool): void {
    this.dispatchPickAction(event, selectedToolId);
  }

  // onMeshPick(mesh: AbstractMesh): void {
  //   mesh.edgesRenderer ? mesh.disableEdgesRendering() : mesh.enableEdgesRendering();
  //   mesh.renderOutline = !mesh.renderOutline;
  // }

  private dispatchPickAction(pickInfo: PointerPickInfo, selectedToolId: Tool): void {
    if (pickInfo.pointerButton !== PointerButton.Main) {
      return;
    }

    switch (selectedToolId) {
      case Tool.AddVoxel:
        this.store.dispatch(addVoxel({ position: pickInfo.pickedPoint, value: 42 }));
        break;
      case Tool.RemoveVoxel:
        this.store.dispatch(removeVoxel({ position: pickInfo.pickedPoint }));
        break;
    }
  }

  private calcNewVoxelPosition(pickInfo: PointerPickInfo): Coord {
    return add(pickInfo.pickedPoint, pickInfo.normal);
  }
}
