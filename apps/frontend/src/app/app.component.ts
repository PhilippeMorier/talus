import { AfterViewInit, ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from './app.reducer';
import { WebSocketService } from './web-socket.service';

@Component({
  selector: 'fe-root',
  template: `
    <ng-container *ngIf="setTheme(isDarkTheme$ | async)"></ng-container>

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

          <div>{{ kafka$ | async | json }}</div>
        </ui-sidenav-shell-left>

        <ui-sidenav-shell-right>
          Right
        </ui-sidenav-shell-right>

        <ui-sidenav-shell-content>
          <fe-scene-viewer-container></fe-scene-viewer-container>
        </ui-sidenav-shell-content>
      </ui-sidenav-shell>
    </main>

    <ui-status-bar [connected]="connectionStatus$ | async"></ui-status-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'frontend';
  isDarkTheme$: Observable<boolean> = this.store.pipe(
    select(fromApp.selectSceneViewerContainerState),
    map(state => state.isDarkTheme),
  );

  connectionStatus$ = this.webSocketService.connectionStatus$;
  kafka$ = this.webSocketService.listen('kafka');

  constructor(
    private store: Store<fromApp.State>,
    private renderer: Renderer2,
    private webSocketService: WebSocketService,
  ) {}

  ngAfterViewInit(): void {
    // this.webSocketService.emit('kafka', { dataValue: 'Buh' });
  }

  setTheme(isDarkTheme: boolean): void {
    const toAddClass = isDarkTheme ? 'app-dark-theme' : 'app-light-theme';
    const toRemoveClass = isDarkTheme ? 'app-light-theme' : 'app-dark-theme';

    this.renderer.addClass(document.body, toAddClass);
    this.renderer.removeClass(document.body, toRemoveClass);
  }
}
