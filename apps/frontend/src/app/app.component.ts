import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
// import '@babylonjs/core/Rendering/edgesRenderer';
import '@babylonjs/core/Rendering/outlineRenderer';

@Component({
  selector: 'fe-root',
  template: `
    <ui-sidenav-shell>
      <ui-sidenav-shell-left>
        <fe-tools-panel></fe-tools-panel>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'frontend';

  onPointerPick(pointerEvent: PointerEvent): void {
    console.log(pointerEvent.button);
  }

  onMeshPick(mesh: AbstractMesh): void {
    // mesh.edgesRenderer ? mesh.disableEdgesRendering() : mesh.enableEdgesRendering();
    mesh.renderOutline = !mesh.renderOutline;
  }
}
