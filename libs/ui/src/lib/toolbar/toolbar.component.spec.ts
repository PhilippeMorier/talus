import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UiToolbarComponent } from './toolbar.component';
import { UiToolbarModule } from './toolbar.module';

describe('ToolbarComponent', () => {
  let component: UiToolbarComponent;
  let fixture: ComponentFixture<UiToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiToolbarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
