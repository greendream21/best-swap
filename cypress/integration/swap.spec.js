describe('Swapping', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearSessionStorage();
    cy.server();
    cy.mockAllTheThings();
  });

  it('should be able to swap assets', () => {
    // without a wallet
    cy.visit('/');

    cy.mockBinanceClientMethod('transfer', 'doTransfer');

    cy.wait(['@swap-tomob', '@coingecko']); // HACK: Wait for last swap XHR and price info

    cy.get('[data-test="bepswap-app"]').should('exist');
    cy.get('[data-test="swap-card-BNB"] [data-test="swap-button"]').click();
    cy.get('[data-test="coincard-source-input"]').type('1000{enter}');
    cy.wait(500); // Remove me once we have more CPU?
    cy.get('[data-test="coincard-source-input"]').should(
      'have.value',
      '1,000.00',
    );

    cy.get('[data-test="coincard-target-input"]').should(
      'have.value',
      '797.44',
    );

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');
    cy.contains('PLEASE ADD WALLET');

    cy.contains('Cancel').click();

    // now with a wallet
    cy.uploadWallet('full');

    cy.get('[data-test="swap-card-BNB"] [data-test="swap-button"]').click();

    cy.get('[data-test="selection-button-25"]').click();

    cy.get('[data-test="coincard-source-input"]').should(
      'have.value',
      '252.00',
    );

    cy.get('[data-test="selection-button-50"]').click();
    cy.get('[data-test="coincard-source-input"]').should(
      'have.value',
      '504.00',
    );

    cy.get('[data-test="selection-button-75"]').click();
    cy.get('[data-test="coincard-source-input"]').should(
      'have.value',
      '756.00',
    );

    cy.get('[data-test="selection-button-100"]').click();
    cy.get('[data-test="coincard-source-input"]').should(
      'have.value',
      '1,008.00',
    );

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

    cy.get('[data-test=swapmodal-coin-data-send]').contains('1,008');
    cy.get('[data-test=swapmodal-coin-data-send]').contains('rune');
    cy.get('[data-test=swapmodal-coin-data-send]').contains('$USD 9.37');
    cy.get('[data-test=swapmodal-coin-data-receive]').contains('803.82');
    cy.get('[data-test=swapmodal-coin-data-receive]').contains('bnb');
    cy.get('[data-test=swapmodal-coin-data-receive]').contains('$USD 8.04');
    cy.get('[data-test=swapmodal-fees]').contains('1 RUNE');
    cy.get('[data-test=swapmodal-slip]').contains('14.00%');
  });

  it('should not be able to swap and send assets to a bad address', () => {
    cy.visit('/');
    cy.uploadWallet('full');
    cy.get('[data-test=swap-card-BNB] [data-test=swap-button]').click();

    cy.get('[data-test=forward-to-alternate-address-button]').click(); // TODO: prevent this from clearing the inputs
    cy.get('[data-test=recipient-address-field]').type('someinvalidaddress');
    cy.get('[data-test=selection-button-75]').click(); // TODO: this should be able to be set before clicking address button
    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.contains('Recipient address is invalid!');
  });

  it('should be able to swap and send', () => {
    cy.visit('/');
    cy.mockBinanceClientMethod('transfer', 'doTransfer');
    cy.uploadWallet('full');
    cy.get('[data-test=swap-card-BNB] [data-test=swap-button]').click();

    cy.get('[data-test=forward-to-alternate-address-button]').click(); // TODO: prevent this from clearing the inputs
    cy.get('[data-test=recipient-address-field]').type(
      'tbnb1uf4hln238vmpk366fjrhf3het8slwdxj0h74s3',
    );
    cy.get('[data-test=selection-button-75]').click(); // TODO: this should be able to be set before clicking address button
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
        756,
        'RUNE-A1F',
        'swap:BNB:tbnb1uf4hln238vmpk366fjrhf3het8slwdxj0h74s3:58478390000',
      );
  });

  it('should be able to swap and send token -> token', () => {
    cy.visit('/');
    cy.mockBinanceClientMethod('transfer', 'doTransfer');
    cy.uploadWallet('full');
    cy.get('[data-test=swap-card-BNB] [data-test=swap-button]').click();
    cy.get('[data-test=coincard-source-input]').type('500');
    cy.get(
      '[data-test=coincard-source] [data-test=coin-dropdown-button]',
    ).click();
    cy.get(
      '[data-test=coincard-source-coincard-menu] [data-test=coincard-menu-item-ftm]',
    ).click();
    cy.get(
      '[data-test=coincard-target] [data-test=coin-dropdown-button]',
    ).click();
    cy.get(
      '[data-test=coincard-target-coincard-menu] [data-test=coincard-menu-item-lok]',
    ).click();

    cy.get('[data-test="coincard-source-input"]').should(
      'have.value',
      '500.00',
    );

    cy.get('[data-test="coincard-target-input"]').should(
      'have.value',
      '671.70',
    );

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
        500,
        'FTM-585',
        'swap:LOK-3C0::',
      );
  });
});
