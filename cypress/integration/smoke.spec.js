describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
    cy.get('[data-test="bepswap-app"]').should('exist');
  });
});
