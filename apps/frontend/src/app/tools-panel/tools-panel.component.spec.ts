import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UiToolbarModule } from '@talus/ui';
import { Observable, of } from 'rxjs';
import { default as fromApp } from '../app.reducer';
import { initialMockState } from '../testing';
import { ToolsPanelComponent } from './tools-panel.component';

describe('ToolsPanelComponent', () => {
  let component: ToolsPanelComponent;
  let fixture: ComponentFixture<ToolsPanelComponent>;

  const actions$: Observable<Action> = of();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolsPanelComponent],
      imports: [UiToolbarModule],
      providers: [
        provideMockStore<fromApp.State>({
          initialState: initialMockState,
        }),
        provideMockActions(() => actions$),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
