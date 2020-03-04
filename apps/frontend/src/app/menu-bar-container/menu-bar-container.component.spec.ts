import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { ROOT_REDUCERS, State } from '../app.reducer';
import { undo } from './menu-bar-container.actions';
import { MenuBarContainerComponent } from './menu-bar-container.component';
import { MenuBarContainerModule } from './menu-bar-container.module';

describe('MenuBarContainerComponent', () => {
  let component: MenuBarContainerComponent;
  let fixture: ComponentFixture<MenuBarContainerComponent>;

  let store: MockStore<State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MenuBarContainerModule,
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
    spyOn(store, 'dispatch');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBarContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch action', () => {
    component.onMenuItemClick(undo());

    expect(store.dispatch).toHaveBeenCalledWith(undo());
  });
});
