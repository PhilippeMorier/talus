import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiSidenavShellModule } from './sidenav-shell.module';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  template: `
    <ui-sidenav-shell>
      <ui-sidenav-shell-left>Left</ui-sidenav-shell-left>

      <ui-sidenav-shell-right>Right</ui-sidenav-shell-right>

      <ui-sidenav-shell-content>
        <div>Content</div>
      </ui-sidenav-shell-content>
    </ui-sidenav-shell>
  `,
  styles: [
    `
      div {
        height: 100px;
        width: 100px;
        margin: 50px auto;
        background-color: green;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class UiSidenavShellTestComponent {}

export default {
  title: 'UiSidenavShellComponent',
};

export const primary = () => ({
  moduleMetadata: {
    declarations: [UiSidenavShellTestComponent],
    imports: [UiSidenavShellModule],
  },
  component: UiSidenavShellTestComponent,
});
