declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('left-panel')
     */
    dataCy(value: string): Chainable<Subject>;
  }
}

Cypress.Commands.add('dataCy', value => cy.get(`[data-cy=${value}]`));
