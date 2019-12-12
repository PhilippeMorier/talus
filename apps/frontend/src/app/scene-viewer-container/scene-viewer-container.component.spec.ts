import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MemoizedSelector, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PointerButton, PointerPickInfo } from '@talus/ui';
import { Subject } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Tool } from '../tools-panel/tool.model';
import { addVoxel, removeVoxel } from './scene-viewer-container.actions';
import { SceneViewerContainerComponent } from './scene-viewer-container.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ui-scene-viewer',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SceneViewerStubComponent {
  @Output() pointerPick = new Subject<PointerPickInfo>();
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
    spyOn(mockStore, 'dispatch');

    mockSelectedToolIdSelector = mockStore.overrideSelector(
      fromApp.selectSelectedToolId,
      Tool.AddVoxel,
    );
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
      pointerButton: PointerButton.Secondary,
      normal: [0, 0, 0],
    });

    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch `addVoxel` action', () => {
    const action = addVoxel({ position: [1, 1, 1], value: 42 });

    stubComponent.pointerPick.next({
      pickedPoint: [1, 1, 1],
      pointerButton: PointerButton.Main,
      normal: [0, 0, 1],
    });

    expect(mockStore.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch `removeVoxel` action', () => {
    mockSelectedToolIdSelector.setResult(Tool.RemoveVoxel);
    mockStore.refreshState();
    fixture.detectChanges();

    const action = removeVoxel({ position: [1, 1, 1] });

    stubComponent.pointerPick.next({
      pickedPoint: [1, 1, 1],
      pointerButton: PointerButton.Main,
      normal: [0, 0, 1],
    });

    expect(mockStore.dispatch).toHaveBeenCalledWith(action);
  });
});
