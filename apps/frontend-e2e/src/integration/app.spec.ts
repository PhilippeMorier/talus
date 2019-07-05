import { getSidenavLeft } from '../support/app.po';

describe('frontend', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getSidenavLeft().contains('Left');
  });
});
