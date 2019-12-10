import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
// import '@babylonjs/core/Rendering/edgesRenderer';
import '@babylonjs/core/Rendering/outlineRenderer';

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
  onPointerPick(pointerEvent: PointerEvent): void {
    console.log(pointerEvent.button);
  }

  onMeshPick(mesh: AbstractMesh): void {
    // mesh.edgesRenderer ? mesh.disableEdgesRendering() : mesh.enableEdgesRendering();
    mesh.renderOutline = !mesh.renderOutline;
  }
}
