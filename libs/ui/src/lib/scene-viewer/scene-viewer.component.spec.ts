import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSceneViewerComponent } from './scene-viewer.component';
import { SceneViewerTestModule } from './scene-viewer.module.testing';

describe('UiSceneViewerComponent', () => {
  let component: UiSceneViewerComponent;
  let fixture: ComponentFixture<UiSceneViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UiSceneViewerComponent],
      imports: [SceneViewerTestModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSceneViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
