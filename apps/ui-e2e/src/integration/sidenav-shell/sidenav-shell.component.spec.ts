describe('sidenav-shell', () => {
  beforeEach(() => cy.visit(`/iframe.html?id=uisidenavshellcomponent--primary`));

  it('expands & collapses panels', () => {
    cy.get('#left-sidenav-button').contains('keyboard_arrow_left').click();
    cy.get('[data-cy=left-sidenav]').should('be.hidden');
    cy.get('#left-sidenav-button').contains('keyboard_arrow_right');

    cy.get('#right-sidenav-button').contains('keyboard_arrow_right').click();
    cy.get('[data-cy=right-sidenav]').should('be.hidden');
    cy.get('#right-sidenav-button').contains('keyboard_arrow_left');
  });
});
