import { UiMenuBarConfig } from '@talus/ui';

const menuConfig: UiMenuBarConfig<string> = {
  menus: [
    {
      label: 'Edit',
      menuItems: [
        {
          icon: 'undo',
          label: 'Undo',
          value: 'undo()',
        },
        {
          icon: 'redo',
          label: 'Redo',
          value: 'redo()',
        },
      ],
    },
  ],
};

describe('ui', () => {
  beforeEach(() =>
    cy.visit(
      `/iframe.html?id=uimenubarcomponent--primary&knob-menuConfig=${JSON.stringify(menuConfig)}`,
    ),
  );

  it('should render all menus/menu-items & and open/close menu', () => {
    cy.get('ui-menu-bar').should('exist');

    cy.get('.mat-menu-trigger').click();
    cy.get('.mat-menu-content').should('have.length', menuConfig.menus.length);
    cy.get('.mat-menu-item').should('have.length', menuConfig.menus[0].menuItems.length);

    cy.get('.cdk-overlay-backdrop').click();
    cy.get('.mat-menu-content').should('not.exist');
  });
});
