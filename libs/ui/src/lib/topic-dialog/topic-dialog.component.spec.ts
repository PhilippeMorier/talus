import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiTopicDialogComponent } from './topic-dialog.component';
import { UiTopicDialogModule } from './topic-dialog.module';

describe('UiTopicDialogComponent', () => {
  let component: UiTopicDialogComponent;
  let fixture: ComponentFixture<UiTopicDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UiTopicDialogModule],
        providers: [
          // https://github.com/angular/components/issues/8419#issuecomment-361972699
          { provide: MatDialogRef, useValue: { close: () => {} } },
          { provide: MAT_DIALOG_DATA, useValue: [] },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UiTopicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
