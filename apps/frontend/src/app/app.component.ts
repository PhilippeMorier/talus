import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fe-root',
  template: `
    <header>
      <fe-menu-bar></fe-menu-bar>
    </header>

    <main>
      <ui-sidenav-shell>
        <ui-sidenav-shell-left>
          <fe-tools-panel></fe-tools-panel>
        </ui-sidenav-shell-left>

        <ui-sidenav-shell-right>
          Right
        </ui-sidenav-shell-right>

        <ui-sidenav-shell-content>
          <fe-scene-viewer-container></fe-scene-viewer-container>
        </ui-sidenav-shell-content>
      </ui-sidenav-shell>
    </main>

    <!--<ui-status-bar></ui-status-bar>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
}
