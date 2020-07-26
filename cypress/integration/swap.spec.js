describe.skip('Swapping', () => {
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
    cy.get(
      '.swap-list-view.desktop-view [data-test="swap-button-bnb"]',
    ).click();
    cy.get('[data-test="coincard-source-input"]').type('10{enter}');
    cy.wait(500); // Remove me once we have more CPU?
    cy.get('[data-test="coincard-source-input"]').should('have.value', '10.00');

    cy.get('[data-test="coincard-target-input"]').should('have.value', '7.97');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');
    cy.contains('PLEASE ADD WALLET');

    cy.contains('Cancel').click();

    // now with a wallet
    cy.uploadWallet('full');

    cy.get(
      '.swap-list-view.desktop-view [data-test="swap-button-bnb"]',
    ).click();

    cy.get('[data-test="coincard-source-input"]').type('10{enter}');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.getWalletPassword().then(pass => {
      cy.get('[data-test="password-confirmation-input"]').type(pass);
    });

    cy.contains('button', 'CONFIRM').click();

    cy.get('@doTransfer')
      .should('be.calledOnce')
      .and(
        'be.calledWith',
        'tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
        'tbnb15r82hgf2e7649zhl4dsqgwc5tj64wf2jztrwd5',
        10,
        'RUNE-67C',
        'swap:BNB::773090000',
      );

    cy.get('[data-test=swapmodal-coin-data-send]').contains('10');
    cy.get('[data-test=swapmodal-coin-data-send]').contains('rune');
    cy.get('[data-test=swapmodal-coin-data-send]').contains('$USD 0.09');
    cy.get('[data-test=swapmodal-coin-data-receive]').contains('7.97');
    cy.get('[data-test=swapmodal-coin-data-receive]').contains('bnb');
    cy.get('[data-test=swapmodal-coin-data-receive]').contains('$USD 0.08');
  });

  it('should not be able to swap and send assets to a bad address', () => {
    cy.visit('/');
    cy.uploadWallet('full');
    cy.get(
      '.swap-list-view.desktop-view [data-test="swap-button-bnb"]',
    ).click();

    cy.get('[data-test=add-recipient-address-button]').click(); // TODO: prevent this from clearing the inputs
    cy.get('[data-test=recipient-address-field]').type('someinvalidaddress');
    cy.get('[data-test="coincard-source-input"]').type('10{enter}');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.contains('Recipient address is invalid!');
  });

  it('should be able to swap and send', () => {
    cy.visit('/');
    cy.mockBinanceClientMethod('transfer', 'doTransfer');
    cy.uploadWallet('full');
    cy.get(
      '.swap-list-view.desktop-view [data-test="swap-button-bnb"]',
    ).click();

    cy.get('[data-test=add-recipient-address-button]').click(); // TODO: prevent this from clearing the inputs
    cy.get('[data-test=recipient-address-field]').type(
      'tbnb1uf4hln238vmpk366fjrhf3het8slwdxj0h74s3',
    );
    cy.get('[data-test="coincard-source-input"]').type('10{enter}');
    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.getWalletPassword().then(pass => {
      cy.get('[data-test="password-confirmation-input"]').type(pass);
    });
    cy.contains('button', 'CONFIRM').click();
    cy.get('@doTransfer')
      .should('be.calledOnce')
      .and(
        'be.calledWith',
        'tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
        'tbnb15r82hgf2e7649zhl4dsqgwc5tj64wf2jztrwd5',
        10,
        'RUNE-67C',
        'swap:BNB:tbnb1uf4hln238vmpk366fjrhf3het8slwdxj0h74s3:773090000',
      );
  });

  it('should be able to swap and send token -> token', () => {
    cy.visit('/');
    cy.mockBinanceClientMethod('transfer', 'doTransfer');
    cy.uploadWallet('full');
    cy.get(
      '.swap-list-view.desktop-view [data-test="swap-button-bnb"]',
    ).click();
    cy.get('[data-test=coincard-source-input]').type('50');
    cy.get(
      '[data-test=coincard-source] [data-test=coin-dropdown-button]',
    ).click();
    cy.get(
      '[data-test=coincard-source-select-menu] [data-test=token-menu-item-ftm]',
    ).click();
    cy.get(
      '[data-test=coincard-target] [data-test=coin-dropdown-button]',
    ).click();
    cy.get(
      '[data-test=coincard-target-select-menu] [data-test=token-menu-item-lok]',
    ).click();

    cy.get('[data-test="coincard-source-input"]').should('have.value', '50.00');

    cy.get('[data-test="coincard-target-input"]').should('have.value', '67.17');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.getWalletPassword().then(pass => {
      cy.get('[data-test="password-confirmation-input"]').type(pass);
    });

    cy.contains('button', 'CONFIRM').click();

    cy.get('@doTransfer')
      .should('be.calledOnce')
      .and(
        'be.calledWith',
        'tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
        'tbnb15r82hgf2e7649zhl4dsqgwc5tj64wf2jztrwd5',
        50,
        'FTM-585',
        'swap:LOK-3C0::',
      );
  });
});
