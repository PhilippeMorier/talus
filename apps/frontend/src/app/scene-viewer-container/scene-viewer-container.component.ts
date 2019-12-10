import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
// import '@babylonjs/core/Rendering/edgesRenderer';
import '@babylonjs/core/Rendering/outlineRenderer';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
import { pointerPick } from './scene-viewer-container.actions';

@Component({
  selector: 'fe-scene-viewer-container',
  template: `
    <ui-scene-viewer
      (meshPick)="onMeshPick($event)"
      (pointerPick)="onPointerPick($event)"
    ></ui-scene-viewer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneViewerContainerComponent {
  constructor(private store: Store<fromApp.State>) {}

  onPointerPick(pointerEvent: PointerEvent): void {
    this.store.dispatch(pointerPick({ pointerButton: pointerEvent.button }));
  }

  onMeshPick(mesh: AbstractMesh): void {
    // mesh.edgesRenderer ? mesh.disableEdgesRendering() : mesh.enableEdgesRendering();
    mesh.renderOutline = !mesh.renderOutline;
  }
}
