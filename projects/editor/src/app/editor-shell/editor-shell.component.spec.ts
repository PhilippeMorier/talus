import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorShellComponent } from './editor-shell.component';

@Component({ selector: 'tls-viewport', template: '' })
class ViewportStubComponent {}

describe('EditorShellComponent', () => {
  let component: EditorShellComponent;
  let fixture: ComponentFixture<EditorShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorShellComponent, ViewportStubComponent],
      imports: [BrowserAnimationsModule, MatSidenavModule, MatIconModule],
    }).compileComponents();
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
