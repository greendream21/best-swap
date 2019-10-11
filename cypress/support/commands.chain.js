Cypress.Commands.add('mockBinanceClientMethod', (methodName, alias) => {
  // spy on binance client
  // This is a little implementationy for an integration test
  // however as transactions are hashed by binance js sdk
  // it kind of the point at which we can check that
  // information is being sent to the chain is correct
  cy.window().then(win => {
    cy.spy(win.binance.bnbClient, methodName).as(alias);
  });
});
