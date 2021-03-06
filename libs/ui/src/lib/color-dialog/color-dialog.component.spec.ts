import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiColorDialogComponent } from './color-dialog.component';
import { UiColorDialogModule } from './color-dialog.module';

describe('ColorDialogComponent', () => {
  let component: UiColorDialogComponent;
  let fixture: ComponentFixture<UiColorDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UiColorDialogModule],
        providers: [
          // https://github.com/angular/components/issues/8419
          { provide: MatDialogRef, useValue: { close: () => {} } },
          { provide: MAT_DIALOG_DATA, useValue: {} },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UiColorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
