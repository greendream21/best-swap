describe('Swapping', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearSessionStorage();
    cy.server();
    // mockAll the things
    cy.mockBaseRoutes();
    cy.mockWalletRoutes();
    cy.mockChainRoutes();
    cy.mockCoingeckoRoutes();
  });

  it('should be able to swap assets', () => {
    // without a wallet
    cy.visit('/');

    // spy on binance client
    // This is a little implementationy for an integration test
    // however as transactions are hashed by binance js sdk
    // it kind of the point at which we can check that
    // information is being sent to the chain is correct
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
