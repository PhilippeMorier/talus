import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiMenuBarModule } from '@talus/ui';
import { UiMenuBarComponent } from './menu-bar.component';

describe('UiMenuBarComponent', () => {
  let component: UiMenuBarComponent;
  let fixture: ComponentFixture<UiMenuBarComponent>;

  const expectedMenus = [
    {
      label: 'Menu 1',
      menuItems: [
        {
          label: 'Item 1.1',
          icon: 'undo',
          value: 'Value 1.1',
        },
      ],
    },
    {
      label: 'Menu 2',
      menuItems: [
        {
          label: 'Item 2.1',
          icon: 'undo',
          value: 'Value 2.1',
        },
        {
          label: 'Item 2.2',
          icon: 'undo',
          value: 'Value 2.2',
        },
      ],
    },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiMenuBarModule, BrowserAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiMenuBarComponent);
    component = fixture.componentInstance;
    // Don't call `detectChanges()`, because of `OnPush`
    // See: https://github.com/angular/angular/issues/12313#issuecomment-301848232
    // fixture.detectChanges();
  });

  beforeEach(() => {
    spyOn(component.menuItemClick, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add all menus', () => {
    component.menuConfig = {
      menus: expectedMenus,
    };
    fixture.detectChanges();

    const menus = fixture.debugElement.queryAll(By.css('mat-menu'));
    const menuButtons = fixture.debugElement.queryAll(By.css('button'));

    expect(menus.length).toEqual(expectedMenus.length);
    expect(menuButtons.length).toEqual(expectedMenus.length);
    expect(menuButtons[0].nativeElement.textContent).toContain(expectedMenus[0].label);
    expect(menuButtons[1].nativeElement.textContent).toContain(expectedMenus[1].label);
  });

  it('should add all menu-items for second menu', () => {
    component.menuConfig = {
      menus: expectedMenus,
    };
    fixture.detectChanges();

    const menuButtons = fixture.debugElement.queryAll(By.css('button'));
    menuButtons[1].nativeElement.click();
    fixture.detectChanges();

    const menuItemButtons = fixture.debugElement.queryAll(By.css('button.mat-menu-item > span'));
    expect(menuItemButtons.length).toEqual(expectedMenus[1].menuItems.length);

    menuItemButtons.forEach((menuItemButton, j) => {
      expect(menuItemButton.nativeElement.textContent).toEqual(expectedMenus[1].menuItems[j].label);
    });
  });

  it('should emit value of clicked menu items', () => {
    component.menuConfig = {
      menus: expectedMenus,
    };
    fixture.detectChanges();

    const menuButtons = fixture.debugElement.queryAll(By.css('button'));
    menuButtons[1].nativeElement.click();
    fixture.detectChanges();

    const menuItemButtons = fixture.debugElement.queryAll(By.css('button.mat-menu-item > span'));

    menuItemButtons[0].nativeElement.click();
    expect(component.menuItemClick.emit).toBeCalledWith('Value 2.1');

    menuItemButtons[1].nativeElement.click();
    expect(component.menuItemClick.emit).toBeCalledWith('Value 2.2');
  });
});
