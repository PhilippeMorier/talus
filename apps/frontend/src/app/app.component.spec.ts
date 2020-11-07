import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UiSceneViewerTestModule, UiSidenavShellModule, UiStatusBarModule } from '@talus/ui';
import { AppComponent } from './app.component';
import * as fromApp from './app.reducer';
import { initialMockState } from './testing';

@Component({
  selector: 'fe-menu-bar-container',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MenuBarContainerStubComponent {}

@Component({
  selector: 'fe-scene-viewer-container',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SceneViewerContainerStubComponent {}

@Component({
  selector: 'fe-tools-panel',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ToolsPanelStubComponent {}

@Component({
  selector: 'fe-options-panel',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class OptionsPanelStubComponent {}

// Skipped due to:
// TypeError: Cannot read property 'runOutsideAngular' of undefined
// at MatSidenav.ChangeDetectionStrategy (/Users/philippe/git/src/material/sidenav/drawer.ts:292:18)
describe.skip('AppComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          MenuBarContainerStubComponent,
          OptionsPanelStubComponent,
          SceneViewerContainerStubComponent,
          ToolsPanelStubComponent,
        ],
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule,
          UiSceneViewerTestModule,
          UiSidenavShellModule,
          UiStatusBarModule,
        ],
        providers: [
          provideMockStore<fromApp.State>({
            initialState: initialMockState,
          }),
        ],
      }).compileComponents();
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render content of left sidenav', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('ui-sidenav-shell-left > fe-tools-panel')).not.toBeNull();
    expect(
      compiled.querySelector('ui-sidenav-shell-content > fe-scene-viewer-container'),
    ).not.toBeNull();
  });
});
