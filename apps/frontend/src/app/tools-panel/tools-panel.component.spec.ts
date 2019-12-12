import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { ROOT_REDUCERS, State } from '../app.reducer';
import { ToolsPanelComponent } from './tools-panel.component';
import { ToolsPanelModule } from './tools-panel.module';

describe('ToolsPanelComponent', () => {
  let component: ToolsPanelComponent;
  let fixture: ComponentFixture<ToolsPanelComponent>;

  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ToolsPanelModule,
        StoreModule.forRoot(ROOT_REDUCERS, {
          runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true,
            strictStateSerializability: true,
            strictActionSerializability: true,
          },
        }),
      ],
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
