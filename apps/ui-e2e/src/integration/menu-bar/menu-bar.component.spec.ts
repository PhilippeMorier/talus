import { UiMenuBarMenu } from '@talus/ui';

const menus: UiMenuBarMenu<string>[] = [
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
];

describe('menu-bar', () => {
  beforeEach(() =>
    cy.visit(`/iframe.html?id=uimenubarcomponent--primary&knob-menus=${JSON.stringify(menus)}`),
  );

  it('renders all menus/menu-items & and open/close menu', () => {
    cy.get('ui-menu-bar').should('exist');

    cy.get('.mat-menu-trigger').click();
    cy.get('.mat-menu-content').should('have.length', menus.length);
    cy.get('.mat-menu-item').should('have.length', menus[0].menuItems.length);

    cy.get('.cdk-overlay-backdrop').click();
    cy.get('.mat-menu-content').should('not.exist');
  });
});
