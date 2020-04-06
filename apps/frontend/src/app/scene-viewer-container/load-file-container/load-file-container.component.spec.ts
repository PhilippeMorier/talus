import { OverlayRef } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UiProgressSpinnerModule, UiSceneViewerTestModule, UI_OVERLAY_DATA } from '@talus/ui';
import { of } from 'rxjs';
import * as fromApp from '../../app.reducer';
import { initialMockState } from '../../testing';
import { LoadFileContainerComponent } from './load-file-container.component';
import { LoadFileService } from './load-file.service';

describe('LoadFileContainerComponent', () => {
  let component: LoadFileContainerComponent;
  let fixture: ComponentFixture<LoadFileContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadFileContainerComponent],
      imports: [UiSceneViewerTestModule, UiProgressSpinnerModule],
      providers: [
        { provide: UI_OVERLAY_DATA, useValue: {} },
        { provide: OverlayRef, useValue: {} },
        {
          provide: LoadFileService,
          useValue: {
            load: () => of({ coords: [], isConverting: false, isLoading: false, progress: 100 }),
          },
        },
        provideMockStore<fromApp.State>({
          initialState: initialMockState,
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFileContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
