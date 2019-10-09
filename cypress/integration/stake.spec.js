describe('Staking', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearSessionStorage();
    cy.server();
    cy.mockAllTheThings();
  });

  it('should be able to stake assets', () => {
    // mock stakerData
    cy.route('/stakerData?staker=*', 'fx:base/stakerData');

    cy.visit('/');

    cy.mockBinanceClientMethod('multiSend', 'doStake');

    cy.wait(['@swap-tomob', '@coingecko']); // HACK: Wait for last XHR and price info

    cy.uploadWallet('full');

    cy.get('[data-test="action-tabs"]')
      .contains('pools')
      .click();

    cy.get('[data-test="pool-card-BNB"] [data-test="stake-button"]').click();

    cy.get('[data-test="stake-coin-input-rune"]').type('1000');
    cy.get('[data-test="stake-coin-input-target"]').type('7{enter}'); // Need to loose focus so the value is available to be used

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.getWalletPassword('full').then(pass => {
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
