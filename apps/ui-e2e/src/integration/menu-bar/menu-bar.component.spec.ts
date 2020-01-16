describe('ui', () => {
  beforeEach(() =>
    cy.visit(
      '/iframe.html?id=uimenubarcomponent--primary&knob-menuConfig={"menus":[{"label":"Edit","menuItems":[{"icon":"undo","label":"Undo","value":"Test%20undo%20value"},{"icon":"redo","label":"Redo","value":"Test%20redo%20value"}]}]}',
    ),
  );

  it('should render', () => {
    cy.get('ui-menu-bar').should('exist');
  });
});
