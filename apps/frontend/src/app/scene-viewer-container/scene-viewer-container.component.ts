import { ChangeDetectionStrategy, Component } from '@angular/core';
// import '@babylonjs/core/Rendering/edgesRenderer';
// import '@babylonjs/core/Rendering/outlineRenderer';
import { select, Store } from '@ngrx/store';
import { PointerButton, PointerPickInfo } from '@talus/ui';
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
  private selectedToolId$: Observable<Tool>;

  constructor(private store: Store<fromApp.State>) {
    this.selectedToolId$ = store.pipe(select(fromApp.selectSelectedToolId));
  }

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
        this.store.dispatch(addVoxel({ position: this.calcNewVoxelPosition(pickInfo), value: 42 }));
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
