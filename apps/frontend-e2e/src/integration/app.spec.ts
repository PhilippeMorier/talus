import { getSidenavLeft } from '../support/app.po';

describe('frontend', () => {
  beforeEach(() => cy.visit('/'));

  it('should display left side navigation', () => {
    getSidenavLeft()
      .get('ui-toolbar')
      .should('exist');
  });
});
