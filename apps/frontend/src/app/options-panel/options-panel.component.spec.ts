import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Rgba } from '@talus/model';
import { Observable, of } from 'rxjs';
import * as fromApp from '../app.reducer';
import { initialMockState } from '../testing';
import { OptionsPanelComponent } from './options-panel.component';

describe('OptionsPanelComponent', () => {
  let component: OptionsPanelComponent;
  let fixture: ComponentFixture<OptionsPanelComponent>;

  let mockStore: MockStore<fromApp.State>;
  const actions$: Observable<Action> = of();
  let mockSelectorSelectColors: MemoizedSelector<fromApp.State, Rgba[]>;

  beforeEach(
    waitForAsync(() => {
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

      mockStore = TestBed.inject(MockStore);
      mockSelectorSelectColors = mockStore.overrideSelector(fromApp.selectColors, []);
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
