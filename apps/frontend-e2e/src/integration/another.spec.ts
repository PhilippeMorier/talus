import { getSidenavRight } from '../support/app.po';

describe('frontend', () => {
  beforeEach(() => cy.visit('/'));

  it('should display right side navigation', () => {
    getSidenavRight().contains('Right');
  });
});
