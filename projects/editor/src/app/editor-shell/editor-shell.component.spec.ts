import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorShellComponent } from './editor-shell.component';

describe('EditorShellComponent', () => {
  let component: EditorShellComponent;
  let fixture: ComponentFixture<EditorShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorShellComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
