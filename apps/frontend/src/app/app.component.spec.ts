import { ChangeDetectionStrategy, Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SceneViewerTestModule, SidenavShellModule } from '@talus/ui';
import { AppComponent } from './app.component';

@Component({
  selector: 'fe-tools-panel',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ToolsPanelStubComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, ToolsPanelStubComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        SidenavShellModule,
        SceneViewerTestModule,
      ],
    }).compileComponents();
  }));

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
    expect(compiled.querySelector('ui-sidenav-shell-content > ui-scene-viewer')).not.toBeNull();
  });
});
