import { Component } from '@angular/core';

@Component({
  selector: 'fe-root',
  template: `
    <ui-sidenav-shell></ui-sidenav-shell>
  `,

  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}
