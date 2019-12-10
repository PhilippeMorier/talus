import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ToolsPanelComponent } from './tools-panel.component';
import { ToolsPanelModule } from './tools-panel.module';
import { initialState, State } from './tools-panel.reducer';

describe('ToolsPanelComponent', () => {
  let component: ToolsPanelComponent;
  let fixture: ComponentFixture<ToolsPanelComponent>;

  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ToolsPanelModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.get<Store<State>>(Store);
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
