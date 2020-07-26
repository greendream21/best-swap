describe.skip('Staking', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearSessionStorage();
    cy.server();
    cy.mockAllTheThings();
  });

  it('should be able to stake assets', () => {
    // mock stakerData
    cy.route('/stakerData?staker=*', 'fx:api/#v1#stakerData/GET/200');

    cy.visit('/');

    cy.mockBinanceClientMethod('multiSend', 'doStake');

    cy.wait(['@swap-tomob', '@coingecko']); // HACK: Wait for last XHR and price info

    cy.uploadWallet('full');

    cy.get('[data-test="action-tabs"]')
      .contains('stake')
      .click();

    cy.get('.pool-list-view.desktop-view [data-test="stake-button-bnb"]').click();

    cy.get('[data-test="stake-coin-input-rune"]').type('10');

    // Target amount is calculated automatically
    // cy.get('[data-test="stake-coin-input-target"]').type('7{enter}'); // Need to loose focus so the value is available to be used

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.getWalletPassword('full').then(pass => {
      cy.get('[data-test="password-confirmation-input"]').type(pass);
    });
    cy.contains('button', 'CONFIRM').click();

    cy.get('@doStake')
      .should('be.calledOnce')
      .and(
        'be.calledWith',
        'tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
        [
          {
            to: 'tbnb15r82hgf2e7649zhl4dsqgwc5tj64wf2jztrwd5',
            coins: [
              { amount: 1254000000, denom: 'BNB' },
              { amount: 1000000000, denom: 'RUNE-67C' },
            ],
          },
        ],
        'stake:BNB',
      );

    cy.get('[data-test="stakeconfirm-coin-data-source"]').contains('10');
    cy.get('[data-test="stakeconfirm-coin-data-source"]').contains('rune');
    cy.get('[data-test="stakeconfirm-coin-data-source"]').contains('$USD 0.09');
    cy.get('[data-test="stakeconfirm-coin-data-target"]').contains('12.54');
    cy.get('[data-test="stakeconfirm-coin-data-target"]').contains('bnb');
    cy.get('[data-test="stakeconfirm-coin-data-target"]').contains('$USD 15.73');
  });
});
