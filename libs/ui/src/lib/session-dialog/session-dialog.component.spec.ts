import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UiSessionDialogModule } from '@talus/ui';
import { EMPTY } from 'rxjs';

import { UiSessionDialogComponent } from './session-dialog.component';

describe('SessionDialogComponent', () => {
  let component: UiSessionDialogComponent;
  let fixture: ComponentFixture<UiSessionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiSessionDialogModule],
      providers: [
        // https://github.com/angular/components/issues/8419#issuecomment-361972699
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: EMPTY },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
