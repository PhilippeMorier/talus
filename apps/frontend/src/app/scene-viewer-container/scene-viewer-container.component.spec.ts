import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Tool, rgbaToInt } from '@talus/model';
import {
  UI_OVERLAY_DATA,
  UiFullscreenOverlayModule,
  UiPointerButton,
  UiPointerPickInfo,
  UiSceneViewerService,
} from '@talus/ui';
import { Coord } from '@talus/vdb';
import { Subject } from 'rxjs';
import * as fromApp from '../app.reducer';
import { initialMockState } from '../testing';
import { GridService } from './grid.service';
import { removeVoxel, setVoxel } from './scene-viewer-container.actions';
import { SceneViewerContainerComponent } from './scene-viewer-container.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ui-scene-viewer',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SceneViewerStubComponent {
  @Output() pointerPick = new Subject<UiPointerPickInfo>();
}

describe('SceneViewerContainerComponent', () => {
  let component: SceneViewerContainerComponent;
  let stubComponent: SceneViewerStubComponent;
  let fixture: ComponentFixture<SceneViewerContainerComponent>;

  let mockStore: MockStore<fromApp.State>;
  let mockSelectedToolIdSelector: MemoizedSelector<fromApp.State, Tool>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UiFullscreenOverlayModule],
        declarations: [SceneViewerContainerComponent, SceneViewerStubComponent],
        providers: [
          GridService,
          { provide: UI_OVERLAY_DATA, useValue: {} },
          { provide: OverlayRef, useValue: {} },
          { provide: UiSceneViewerService, useValue: { resizeView: () => {} } },
          provideMockStore<fromApp.State>({
            initialState: initialMockState,
          }),
        ],
      }).compileComponents();

      mockStore = TestBed.inject(MockStore);

      mockSelectedToolIdSelector = mockStore.overrideSelector(
        fromApp.selectSelectedToolId,
        Tool.SetVoxel,
      );
    }),
  );

  beforeEach(
    waitForAsync(() => {
      spyOn(mockStore, 'dispatch');
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneViewerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    stubComponent = fixture.debugElement.query(By.directive(SceneViewerStubComponent))
      .componentInstance;
  });

  it('should render child component', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('ui-scene-viewer')).not.toBeNull();
  });

  it('should dispatch no action if not PointerButton.Main', () => {
    stubComponent.pointerPick.next({
      pickedPoint: { x: 0, y: 0, z: 0 },
      pointerButton: UiPointerButton.Secondary,
      normal: { x: 0, y: 0, z: 0 },
    });

    // Only once called due to first initial added voxel at [0, 0, 0]
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
  });

  it.each([
    [
      { x: 1, y: 0.2, z: 0.9 },
      { x: 1, y: 0, z: 0 }, // fraction part is removed
      { x: 1, y: 0, z: 0 },
    ],
    [
      { x: 0.99999999, y: 0.2, z: 0.9 },
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
    ],
    [
      { x: 0.2, y: 0.99999999, z: 0.9 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 1, z: 0 },
    ],
    [
      { x: 0.2, y: 0.9, z: 0.0000000001 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
    ],
    [
      { x: 0, y: 0, z: -0.999999 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 0, z: 1 },
    ],
    [
      { x: 0, y: -2, z: -0.999999 },
      { x: 0, y: -3, z: -2 },
      { x: 0, y: 0, z: -1 },
    ],
    [
      { x: -0, y: -2, z: 3 },
      { x: 0, y: -3, z: 2 },
      { x: 0, y: 0, z: -1 },
    ],
    [
      { x: 0.5, y: 1.4, z: -1 },
      { x: 0, y: 1, z: -1 },
      { x: 0, y: 0, z: 1 },
    ],
  ])(
    'should dispatch `setVoxel` action for %j',
    (pickedPoint: Coord, xyz: Coord, normal: Coord) => {
      const initialAction = setVoxel({
        xyz: { x: 0, y: 0, z: 0 },
        newValue: rgbaToInt({ r: 0, g: 255, b: 0, a: 255 }),
      });
      const action = setVoxel({
        xyz,
        newValue: rgbaToInt({
          r: 0,
          g: 255,
          b: 255,
          a: 255,
        }),
        needsSync: true,
      });

      stubComponent.pointerPick.next({
        pickedPoint,
        pointerButton: UiPointerButton.Main,
        normal,
      });

      expect(mockStore.dispatch).toHaveBeenCalledWith(initialAction);
      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    },
  );

  it.each([
    [
      { x: 1.0000000000001, y: 0.5, z: 0.5 },
      { x: 0, y: 0, z: 0 }, // fraction part is removed
      { x: 1, y: 0, z: 0 },
    ],
    [
      { x: 0.999999999999, y: 0.5, z: 0.5 },
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
    ],
    [
      { x: 1.0000000000001, y: -0.5, z: 0.5 },
      { x: 1, y: -1, z: 0 },
      { x: -1, y: 0, z: 0 },
    ],
    [
      { x: -0.999999999999, y: -0.5, z: 0.5 },
      { x: -1, y: -1, z: 0 },
      { x: -1, y: 0, z: 0 },
    ],
    [
      { x: -2.0000000000001, y: -0.5, z: 0.5 },
      { x: -3, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
    ],
    [
      { x: 0.5, y: 0.999999999999, z: 0.5 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    ],
    [
      { x: 0.5461420538559825, y: 0.4841910809236776, z: -2 },
      { x: 0, y: 0, z: -2 },
      { x: 0, y: 0, z: -1 },
    ],
  ])(
    'should dispatch `removeVoxel` action for %j',
    (pickedPoint: Coord, xyz: Coord, normal: Coord) => {
      mockSelectedToolIdSelector.setResult(Tool.RemoveVoxel);
      mockStore.refreshState();
      fixture.detectChanges();

      const initialAction = setVoxel({
        xyz: { x: 0, y: 0, z: 0 },
        newValue: rgbaToInt({ r: 0, g: 255, b: 0, a: 255 }),
      });

      const action = removeVoxel({ xyz, needsSync: true });

      stubComponent.pointerPick.next({
        pickedPoint,
        pointerButton: UiPointerButton.Main,
        normal,
      });

      expect(mockStore.dispatch).toHaveBeenCalledWith(initialAction);
      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    },
  );
});
