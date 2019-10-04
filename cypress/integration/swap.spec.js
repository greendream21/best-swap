function mockSwapRoutes() {
  // This mocks all the base routes
  // Currently al these fixtures are in the /swap folder but it may make more sense to pull these
  // out as we create more tests and then override as required

  cy.route(
    'GET',
    'https://api.coingecko.com/api/v3//simple/price?ids=thorchain&vs_currencies=usd',
    'fx:swap/coingecko',
  ).as('coingecko');
  cy.route(
    'GET',
    'https://testnet-dex.binance.org/api/v1/node-info',
    'fx:swap/node-info',
  ).as('node-info');
  cy.route('GET', '/swapservice/pools', 'fx:swap/pools').as('pools');
  cy.route('GET', '/poolData?asset=BNB', 'fx:swap/pool-bnb').as('pool-bnb');
  cy.route('GET', '/poolData?asset=FSN-F1B', 'fx:swap/pool-fsn').as('pool-fsn');
  cy.route('GET', '/poolData?asset=TCAN-014', 'fx:swap/pool-tcan').as(
    'pool-tcan',
  );
  cy.route('GET', '/poolData?asset=TOMOB-1E1', 'fx:swap/pool-tomob').as(
    'pool-tomob',
  );
  cy.route('GET', '/poolData?asset=FTM-585', 'fx:swap/pool-ftm').as('pool-ftm');
  cy.route('GET', '/poolData?asset=LOK-3C0', 'fx:swap/pool-lok').as('pool-lok');
  cy.route('GET', '/swapData?asset=FSN-F1B', 'fx:swap/swap-fsn').as('swap-fsn');
  cy.route('GET', '/swapData?asset=BNB', 'fx:swap/swap-bnb').as('swap-bnb');
  cy.route('GET', '/swapData?asset=FTM-585', 'fx:swap/swap-ftm').as('swap-ftm');
  cy.route('GET', '/swapData?asset=LOK-3C0', 'fx:swap/swap-lok').as('swap-lok');
  cy.route('GET', '/swapData?asset=TOMOB-1E1', 'fx:swap/swap-tomob').as(
    'swap-tomob',
  );
  cy.route('GET', '/swapData?asset=TCAN-014', 'fx:swap/swap-tcan').as(
    'swap-tcan',
  );
  cy.route('GET', '/tokens', 'fx:swap/tokens').as('tokens');
  cy.route('GET', '/tokens?token=BNB', 'fx:swap/token-bnb').as('token-bnb');
  cy.route('GET', '/tokens?token=FSN-F1B', 'fx:swap/token-fsn').as('token-fsn');
  cy.route('GET', '/tokens?token=FTM-585', 'fx:swap/token-ftm').as('token-ftm');
  cy.route('GET', '/tokens?token=LOK-3C0', 'fx:swap/token-lok').as('token-lok');
  cy.route('GET', '/tokens?token=TCAN-014', 'fx:swap/token-tcan').as(
    'token-tcan',
  );
  cy.route('GET', '/tokens?token=TOMOB-1E1', 'fx:swap/token-tomob').as(
    'token-tomob',
  );

  // TODO: Not sure if or how account should change after this exactly
  cy.route(
    'POST',
    'https://testnet-dex.binance.org/api/v1/broadcast?sync=true',
    'fx:swap/broadcast',
  ).as('broadcast');
}

describe('Swapping', () => {
  before(() => {
    cy.clearCookies();
    cy.clearSessionStorage();
    cy.server({ force404: true });
    mockSwapRoutes(); // mock basic routes override specific routes to test failure conditions
  });

  it('should be able to swap assets', () => {
    // without a wallet
    cy.visit('/');

    // spy on transfer function
    cy.window().then(win => {
      cy.spy(win.binance, 'transfer').as('doTransfer');
    });

    // Wait for last swap XHR and price info
    cy.wait(['@swap-tomob', '@coingecko']);

    cy.get('[data-test="bepswap-app"]').should('exist');
    cy.get('[data-test="swap-card-BNB"] [data-test="swap-button"]').click();
    cy.get('[data-test="coincard-source-input"]').type('1000');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');
    cy.contains('PLEASE ADD WALLET');

    cy.contains('Cancel').click();

    // now with a wallet
    cy.uploadWallet();

    cy.get('[data-test="swap-card-BNB"] [data-test="swap-button"]').click();

    // We need to wait for the dust to settle when applying a wallet because of the way gitlab's
    // CPU is throttled. Because we are waiting on CPU we cannot wait on a request to return.
    // If we click immediately it causes a race condition that fails the tests.
    // Note this is not network latency but CPU throttling.
    // TODO: fix this
    // It may make sense to ensure this process is done synchronously before navigating away from
    // the upload page
    cy.wait(3000);

    cy.get('[data-test="selection-button-25"]').click();

    cy.get('[data-test="coincard-source-input"]').should('have.value', '252');

    cy.get('[data-test="selection-button-50"]').click();
    cy.get('[data-test="coincard-source-input"]').should('have.value', '504');

    cy.get('[data-test="selection-button-75"]').click();
    cy.get('[data-test="coincard-source-input"]').should('have.value', '756');

    cy.get('[data-test="selection-button-100"]').click();
    cy.get('[data-test="coincard-source-input"]').should('have.value', '1,008');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.getWalletPassword().then(pass => {
      cy.get('[data-test="password-confirmation-input"]').type(pass);
    });

    cy.contains('Confirm').click();

    cy.get('@doTransfer')
      .should('be.calledOnce')
      .and(
        'be.calledWith',
        'tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
        'tbnb15r82hgf2e7649zhl4dsqgwc5tj64wf2jztrwd5',
        1008,
        'RUNE-A1F',
        'swap:BNB::77970540000',
      );

    cy.get('[data-test="swapmodal-coin-data-send"]').contains('1,008');
    cy.get('[data-test="swapmodal-coin-data-send"]').contains('rune');
    cy.get('[data-test="swapmodal-coin-data-send"]').contains('$USD 9.37');
    cy.get('[data-test="swapmodal-coin-data-receive"]').contains('803.82');
    cy.get('[data-test="swapmodal-coin-data-receive"]').contains('bnb');
    cy.get('[data-test="swapmodal-coin-data-receive"]').contains('$USD 8.04');
    cy.get('[data-test="swapmodal-fees"]').contains('1 RUNE');
    cy.get('[data-test="swapmodal-slip"]').contains('14.00%');
  });
});
