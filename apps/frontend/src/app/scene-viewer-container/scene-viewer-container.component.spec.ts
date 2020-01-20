import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MemoizedSelector, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UiPointerButton, UiPointerPickInfo } from '@talus/ui';
import { Coord } from '@talus/vdb';
import { Subject } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Tool } from '../tools-panel/tool.model';
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SceneViewerContainerComponent, SceneViewerStubComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    mockStore = TestBed.get(Store);

    mockSelectedToolIdSelector = mockStore.overrideSelector(
      fromApp.selectSelectedToolId,
      Tool.SetVoxel,
    );
  }));

  beforeEach(async(() => {
    spyOn(mockStore, 'dispatch');
  }));

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
      pickedPoint: [0, 0, 0],
      pointerButton: UiPointerButton.Secondary,
      normal: [0, 0, 0],
    });

    // Only once called due to first initial added voxel at [0, 0, 0]
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
  });

  it.each([
    [
      [1, 0.2, 0.9],
      [1, 0.2, 0.9],
      [1, 0, 0],
    ],
    [
      [0.99999999, 0.2, 0.9],
      [1, 0.2, 0.9],
      [1, 0, 0],
    ],
    [
      [0.2, 0.99999999, 0.9],
      [0.2, 1, 0.9],
      [0, 1, 0],
    ],
    [
      [0.2, 0.9, 0.0000000001],
      [0.2, 0.9, 0],
      [0, 0, 1],
    ],
    [
      [0, 0, -0.999999],
      [0, 0, -1],
      [0, 0, 1],
    ],
    [
      [0, -2, -0.999999],
      [0, -3, -2],
      [0, 0, -1],
    ],
    [
      [-0, -2, 3],
      [-0, -3, 2],
      [0, 0, -1],
    ],
    [
      [0.5, 1.4, -1],
      [0.5, 1.4, -1],
      [0, 0, 1],
    ],
  ])(
    'should dispatch `setVoxel` action for %j',
    (pickedPoint: Coord, position: Coord, normal: Coord) => {
      const initialAction = setVoxel({ xyz: [0, 0, 0], newValue: 42 });
      const action = setVoxel({ xyz: position, newValue: 1 });

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
      [1.0000000000001, 0.5, 0.5],
      [0, 0.5, 0.5],
      [1, 0, 0],
    ],
    [
      [0.999999999999, 0.5, 0.5],
      [1, 0.5, 0.5],
      [-1, 0, 0],
    ],
    [
      [1.0000000000001, -0.5, 0.5],
      [1, -1.5, 0.5],
      [-1, 0, 0],
    ],
    [
      [-0.999999999999, -0.5, 0.5],
      [-1, -1.5, 0.5],
      [-1, 0, 0],
    ],
    [
      [-2.0000000000001, -0.5, 0.5],
      [-3, -1.5, 0.5],
      [1, 0, 0],
    ],
    [
      [0.5, 0.999999999999, 0.5],
      [0.5, 0, 0.5],
      [0, 1, 0],
    ],
    [
      [0.5461420538559825, 0.4841910809236776, -2],
      [0.5461420538559825, 0.4841910809236776, -2],
      [0, 0, -1],
    ],
  ])(
    'should dispatch `removeVoxel` action for %j',
    (pickedPoint: Coord, position: Coord, normal: Coord) => {
      mockSelectedToolIdSelector.setResult(Tool.RemoveVoxel);
      mockStore.refreshState();
      fixture.detectChanges();

      const action = removeVoxel({ xyz: position });

      stubComponent.pointerPick.next({
        pickedPoint,
        pointerButton: UiPointerButton.Main,
        normal,
      });

      expect(mockStore.dispatch).toHaveBeenCalledWith(action);
    },
  );
});
