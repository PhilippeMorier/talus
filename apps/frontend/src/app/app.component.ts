import { Component } from '@angular/core';

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
        <ui-scene-viewer></ui-scene-viewer>
      </ui-sidenav-shell-content>
    </ui-sidenav-shell>
  `,

  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
}
