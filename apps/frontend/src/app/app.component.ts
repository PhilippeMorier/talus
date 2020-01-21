import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fe-root',
  template: `
    <header>
      <fe-menu-bar-container></fe-menu-bar-container>
    </header>

    <main>
      <ui-sidenav-shell>
        <ui-sidenav-shell-left>
          <h5>Tools</h5>
          <fe-tools-panel></fe-tools-panel>

          <h5>Options</h5>
          <fe-options-panel></fe-options-panel>
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
