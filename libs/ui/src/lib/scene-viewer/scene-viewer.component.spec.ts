import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SceneViewerTestModule } from '@talus/ui';
import { SceneViewerComponent } from './scene-viewer.component';

describe('SceneViewerComponent', () => {
  let component: SceneViewerComponent;
  let fixture: ComponentFixture<SceneViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SceneViewerTestModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
