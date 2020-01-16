import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiToolbarComponent, UiToolbarToolConfig } from './toolbar.component';
import { UiToolbarModule } from './toolbar.module';

describe('ToolbarComponent', () => {
  let component: UiToolbarComponent;
  let fixture: ComponentFixture<UiToolbarComponent>;

  const tools: UiToolbarToolConfig<string>[] = [
    {
      icon: 'add_circle_outline',
      tooltip: 'Add',
      value: 'Add test value',
    },
    {
      icon: 'remove_circle_outline',
      tooltip: 'Remove',
      value: 'Remove test value',
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiToolbarModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiToolbarComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  beforeEach(() => {
    spyOn(component.toolChange, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit tool change', () => {
    component.tools = tools;
    fixture.detectChanges();

    const buttonToggles = fixture.debugElement.queryAll(By.css('button.mat-button-toggle-button'));
    expect(buttonToggles.length).toEqual(tools.length);

    buttonToggles[0].nativeElement.click();
    fixture.detectChanges();

    expect(component.toolChange.emit).toHaveBeenCalled();
  });
});
