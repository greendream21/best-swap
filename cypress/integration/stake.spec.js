describe('Staking', () => {
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

  it('should be able to stake assets', () => {
    // mock stakerData
    cy.route('/stakerData?staker=*', 'fx:base/stakerData');

    cy.visit('/');

    // spy on binance client
    // This is a little implementationy for an integration test
    // however as transactions are hashed by binance js sdk
    // it kind of the point at which we can check that
    // information being sent to the chain is correct
    cy.window().then(win => {
      cy.spy(win.binance, 'multiSend').as('doStake');
    });

    // Wait for last swap XHR and price info
    cy.wait(['@swap-tomob', '@coingecko']);

    cy.uploadWallet();

    cy.get('[data-test="action-tabs"]')
      .contains('pools')
      .click();

    cy.get('[data-test="pool-card-BNB"] [data-test="stake-button"]').click();
    cy.get('[data-test="stake-coin-input-rune"]').type('1000');
    cy.get('[data-test="stake-coin-input-target"]').type('7');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.getWalletPassword().then(pass => {
      cy.get('[data-test="password-confirmation-input"]').type(pass);
    });
    cy.contains('Confirm').click();

    cy.get('@doStake')
      .should('be.calledOnce')
      .and(
        'be.calledWith',
        'tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
        [
          {
            to: 'tbnb15r82hgf2e7649zhl4dsqgwc5tj64wf2jztrwd5',
            coins: [
              { amount: 700000000, denom: 'BNB' },
              { amount: 100000000000, denom: 'RUNE-A1F' },
            ],
          },
        ],
        'stake:BNB',
      );

    cy.get('[data-test="stakeconfirm-coin-data-source"]').contains('1,000');
    cy.get('[data-test="stakeconfirm-coin-data-source"]').contains('rune');
    cy.get('[data-test="stakeconfirm-coin-data-source"]').contains('$USD 9.29');
    cy.get('[data-test="stakeconfirm-coin-data-target"]').contains('7');
    cy.get('[data-test="stakeconfirm-coin-data-target"]').contains('bnb');
    cy.get('[data-test="stakeconfirm-coin-data-target"]').contains('$USD 8.78');
  });
});
