// This should be for default mocks not mocks that any specific test relies on.

function mockCoingeckoRoutes() {
  cy.route(
    'GET',
    'https://api.coingecko.com/api/v3//simple/price?ids=thorchain&vs_currencies=usd',
    'fx:coingecko/#api#v3#simple#price/GET/200.thorchain-usd',
  ).as('coingecko');
}

function mockBaseRoutes() {
  // This mocks all the base routes
  // Override for each test case with a specific override
  cy.route(
    'GET',
    '/thorchain/pools',
    'fx:chain/#v1#thorchain#pools/GET/200',
  ).as('pools');

  cy.route('GET', '/poolData?asset=BNB', 'fx:api/#v1#poolData/GET/200.bnb').as(
    'pool-bnb',
  );
  cy.route(
    'GET',
    '/poolData?asset=FSN-F1B',
    'fx:api/#v1#poolData/GET/200.fsn',
  ).as('pool-fsn');
  cy.route(
    'GET',
    '/poolData?asset=TCAN-014',
    'fx:api/#v1#poolData/GET/200.tcan',
  ).as('pool-tcan');
  cy.route(
    'GET',
    '/poolData?asset=TOMOB-1E1',
    'fx:api/#v1#poolData/GET/200.tomob',
  ).as('pool-tomob');
  cy.route(
    'GET',
    '/poolData?asset=FTM-585',
    'fx:api/#v1#poolData/GET/200.ftm',
  ).as('pool-ftm');
  cy.route(
    'GET',
    '/poolData?asset=LOK-3C0',
    'fx:api/#v1#poolData/GET/200.lok',
  ).as('pool-lok');
  cy.route(
    'GET',
    '/swapData?asset=FSN-F1B',
    'fx:api/#v1#swapData/GET/200.fsn',
  ).as('swap-fsn');
  cy.route('GET', '/swapData?asset=BNB', 'fx:api/#v1#swapData/GET/200.bnb').as(
    'swap-bnb',
  );
  cy.route(
    'GET',
    '/swapData?asset=FTM-585',
    'fx:api/#v1#swapData/GET/200.ftm',
  ).as('swap-ftm');
  cy.route(
    'GET',
    '/swapData?asset=LOK-3C0',
    'fx:api/#v1#swapData/GET/200.lok',
  ).as('swap-lok');
  cy.route(
    'GET',
    '/swapData?asset=TOMOB-1E1',
    'fx:api/#v1#swapData/GET/200.tomob',
  ).as('swap-tomob');
  cy.route(
    'GET',
    '/swapData?asset=TCAN-014',
    'fx:api/#v1#swapData/GET/200.tcan',
  ).as('swap-tcan');
  cy.route('GET', '/tokens', 'fx:api/#v1#tokens/GET/200').as('tokens');
  cy.route('GET', '/tokens?token=BNB', 'fx:api/#v1#tokens/GET/200.bnb').as(
    'token-bnb',
  );
  cy.route('GET', '/tokens?token=FSN-F1B', 'fx:api/#v1#tokens/GET/200.fsn').as(
    'token-fsn',
  );
  cy.route('GET', '/tokens?token=FTM-585', 'fx:api/#v1#tokens/GET/200.ftm').as(
    'token-ftm',
  );
  cy.route('GET', '/tokens?token=LOK-3C0', 'fx:api/#v1#tokens/GET/200.lok').as(
    'token-lok',
  );
  cy.route(
    'GET',
    '/tokens?token=TCAN-014',
    'fx:api/#v1#tokens/GET/200.tcan',
  ).as('token-tcan');
  cy.route(
    'GET',
    '/tokens?token=TOMOB-1E1',
    'fx:api/#v1#tokens/GET/200.tomob',
  ).as('token-tomob');
  cy.route(
    'GET',
    '/stakerData?staker=*&asset=',
    'fx:api/#v1#stakerData/GET/200.with-asset',
  ).as('staked-tokens');
  cy.route(
    'GET',
    '/stakerData?staker=*',
    'fx:api/#v1#stakerData/GET/200.with-asset',
  ).as('staked-tokens');
}

function mockDexRoutes() {
  cy.route(
    'GET',
    'https://testnet-dex.binance.org/api/v1/node-info',
    'fx:dex/#api#v1#node-info/GET/200',
  ).as('node-info');
  cy.route(
    'POST',
    'https://testnet-dex.binance.org/api/v1/broadcast?sync=true',
    'fx:dex/#api#v1#broadcast/GET/200.sync',
  ).as('broadcast');
}

Cypress.Commands.add('mockBaseRoutes', () => {
  mockBaseRoutes();
});

Cypress.Commands.add('mockAllTheThings', () => {
  mockDexRoutes();
  mockBaseRoutes();
  mockCoingeckoRoutes();
});
