import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from './app.reducer';

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
          <h6 class="mat-h6">Tools</h6>
          <fe-tools-panel></fe-tools-panel>

          <h6 class="mat-h6">Options</h6>
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

    <ui-status-bar
      [connected]="isConnectedToKafkaProxy$ | async"
      [status]="topicName$ | async"
      [progressValue]="topicLoadingProgressValue$ | async"
    ></ui-status-bar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  isDarkTheme$: Observable<boolean> = this.store.pipe(
    select(fromApp.selectSceneViewerContainerState),
    map(state => state.isDarkTheme),
  );

  topicName$: Observable<string | undefined> = this.store.pipe(
    select(fromApp.selectSceneViewerContainerState),
    map(state => state.topic),
  );

  isConnectedToKafkaProxy$: Observable<boolean> = this.store.pipe(
    select(fromApp.selectSceneViewerContainerState),
    map(state => state.isConnectedToKafkaProxy),
  );

  topicLoadingProgressValue$: Observable<number> = this.store.pipe(
    select(fromApp.selectTopicLoadingProgressValue),
  );

  constructor(private store: Store<fromApp.State>, private renderer: Renderer2) {}

  setTheme(isDarkTheme: boolean): void {
    const toAddClass = isDarkTheme ? 'app-dark-theme' : 'app-light-theme';
    const toRemoveClass = isDarkTheme ? 'app-light-theme' : 'app-dark-theme';

    this.renderer.addClass(document.body, toAddClass);
    this.renderer.removeClass(document.body, toRemoveClass);
  }
}
