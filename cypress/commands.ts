declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('left-panel')
     */
    dataCy(value: string): Chainable;
  }
}

Cypress.Commands.add('dataCy', value => {
  return cy.get(`[data-cy=${value}]`, { log: false });
});
