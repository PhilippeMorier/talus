import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, MemoizedSelector, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import * as fromApp from '../app.reducer';
import { Rgba } from '../model/rgba.value';
import { initialMockState } from '../testing';
import { OptionsPanelComponent } from './options-panel.component';

describe('OptionsPanelComponent', () => {
  let component: OptionsPanelComponent;
  let fixture: ComponentFixture<OptionsPanelComponent>;

  let mockStore: MockStore<fromApp.State>;
  const actions$: Observable<Action> = of();
  let mockSelectorSelectColors: MemoizedSelector<fromApp.State, Rgba[]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptionsPanelComponent],
      imports: [MatIconModule],
      providers: [
        provideMockStore<fromApp.State>({
          initialState: initialMockState,
        }),
        provideMockActions(() => actions$),
      ],
    }).compileComponents();

    mockStore = TestBed.get(Store);
    mockSelectorSelectColors = mockStore.overrideSelector(fromApp.selectColors, []);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
