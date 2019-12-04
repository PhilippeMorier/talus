import { Component } from '@angular/core';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import '@babylonjs/core/Rendering/edgesRenderer';

@Component({
  selector: 'fe-root',
  template: `
    <ui-sidenav-shell>
      <ui-sidenav-shell-left>
        Left
      </ui-sidenav-shell-left>

      <ui-sidenav-shell-right>
        Right
      </ui-sidenav-shell-right>

      <ui-sidenav-shell-content>
        <ui-scene-viewer
          (meshPick)="onMeshPick($event)"
          (pointerPick)="onPointerPick($event)"
        ></ui-scene-viewer>
      </ui-sidenav-shell-content>
    </ui-sidenav-shell>
  `,
})
export class AppComponent {
  title = 'frontend';

  onPointerPick(pointerEvent: PointerEvent): void {
    console.log(pointerEvent.button);
  }

  onMeshPick(mesh: AbstractMesh): void {
    // mesh.renderOutline = !mesh.renderOutline;
    mesh.edgesRenderer ? mesh.disableEdgesRendering() : mesh.enableEdgesRendering();
  }
}
