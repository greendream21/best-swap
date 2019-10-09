// This should be for default mocks not mocks that any specific test relies on.

function mockCoingeckoRoutes() {
  cy.route(
    'GET',
    'https://api.coingecko.com/api/v3//simple/price?ids=thorchain&vs_currencies=usd',
    'fx:coingecko/coingecko',
  ).as('coingecko');
}

function mockBaseRoutes() {
  // This mocks all the base routes
  // Override for each test case with a specific override
  cy.route('GET', '/swapservice/pools', 'fx:base/pools').as('pools');
  cy.route('GET', '/poolData?asset=BNB', 'fx:base/pool-bnb').as('pool-bnb');
  cy.route('GET', '/poolData?asset=FSN-F1B', 'fx:base/pool-fsn').as('pool-fsn');
  cy.route('GET', '/poolData?asset=TCAN-014', 'fx:base/pool-tcan').as(
    'pool-tcan',
  );
  cy.route('GET', '/poolData?asset=TOMOB-1E1', 'fx:base/pool-tomob').as(
    'pool-tomob',
  );
  cy.route('GET', '/poolData?asset=FTM-585', 'fx:base/pool-ftm').as('pool-ftm');
  cy.route('GET', '/poolData?asset=LOK-3C0', 'fx:base/pool-lok').as('pool-lok');
  cy.route('GET', '/swapData?asset=FSN-F1B', 'fx:base/swap-fsn').as('swap-fsn');
  cy.route('GET', '/swapData?asset=BNB', 'fx:base/swap-bnb').as('swap-bnb');
  cy.route('GET', '/swapData?asset=FTM-585', 'fx:base/swap-ftm').as('swap-ftm');
  cy.route('GET', '/swapData?asset=LOK-3C0', 'fx:base/swap-lok').as('swap-lok');
  cy.route('GET', '/swapData?asset=TOMOB-1E1', 'fx:base/swap-tomob').as(
    'swap-tomob',
  );
  cy.route('GET', '/swapData?asset=TCAN-014', 'fx:base/swap-tcan').as(
    'swap-tcan',
  );
  cy.route('GET', '/tokens', 'fx:base/tokens').as('tokens');
  cy.route('GET', '/tokens?token=BNB', 'fx:base/token-bnb').as('token-bnb');
  cy.route('GET', '/tokens?token=FSN-F1B', 'fx:base/token-fsn').as('token-fsn');
  cy.route('GET', '/tokens?token=FTM-585', 'fx:base/token-ftm').as('token-ftm');
  cy.route('GET', '/tokens?token=LOK-3C0', 'fx:base/token-lok').as('token-lok');
  cy.route('GET', '/tokens?token=TCAN-014', 'fx:base/token-tcan').as(
    'token-tcan',
  );
  cy.route('GET', '/tokens?token=TOMOB-1E1', 'fx:base/token-tomob').as(
    'token-tomob',
  );
  cy.route('GET', '/stakerData?staker=*&asset=', 'fx:base/staked-tokens').as(
    'staked-tokens',
  );
}

function mockChainRoutes() {
  cy.route(
    'GET',
    'https://testnet-dex.binance.org/api/v1/node-info',
    'fx:chain/node-info',
  ).as('node-info');
  cy.route(
    'POST',
    'https://testnet-dex.binance.org/api/v1/broadcast?sync=true',
    'fx:chain/broadcast',
  ).as('broadcast');
}

Cypress.Commands.add('mockBaseRoutes', () => {
  mockBaseRoutes();
});

Cypress.Commands.add('mockAllTheThings', () => {
  mockChainRoutes();
  mockBaseRoutes();
  mockCoingeckoRoutes();
});
