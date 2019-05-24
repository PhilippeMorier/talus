import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SceneService } from '../../scene.service';
import { ViewportComponent } from './viewport.component';

describe('ViewportComponent', () => {
  let component: ViewportComponent;
  let fixture: ComponentFixture<ViewportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewportComponent],
      providers: [SceneService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
