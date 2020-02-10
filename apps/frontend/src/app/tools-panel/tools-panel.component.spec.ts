import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from '../app.reducer';
import { ToolsPanelComponent } from './tools-panel.component';
import { ToolsPanelModule } from './tools-panel.module';

describe('ToolsPanelComponent', () => {
  let component: ToolsPanelComponent;
  let fixture: ComponentFixture<ToolsPanelComponent>;

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
