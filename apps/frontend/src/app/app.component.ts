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
        Content
      </ui-sidenav-shell-content>
    </ui-sidenav-shell>
  `,

  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}
