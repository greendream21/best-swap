const fullAccount = require('../fixtures/dex/#api#v1#account#{walletId}/GET/200.account-full.json');

describe('Wallet', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearSessionStorage();
    cy.server();
    cy.mockAllTheThings();
  });

  it('should show correct wallet balances', () => {
    cy.visit('/connect');
    cy.uploadWallet('full');
    
    cy.visit('/');

    cy.get('[data-test="wallet-draw-button"]').click();

    cy.contains('Tokens in your wallet');

    const mockBalances = fullAccount.balances.map(({ symbol, free }) => {
      return {
        sym: symbol.split('-')[0].toLowerCase(),
        amt: Number(free).toLocaleString(),
      };
    });

    mockBalances.forEach(({ sym, amt }) => {
      cy.get(
        `[data-test="coin-list-item-${sym}"] [data-test="coin-data-asset-value"]`,
      ).should('have.text', amt);
    });

    cy.get('[data-test="wallet-view-tabs"] .ant-tabs-nav-wrap')
      .contains('stakes')
      .click();

    cy.contains('Your current stakes are');

    // TODO: remove LOK-3C0 as it is dynamic data
    // cy.get('[data-test="coin-list-item-rune"]').contains('LOK-3C0');

    cy.get('.ant-drawer-mask').click();
  });

  it('should show the empty wallet message', () => {
    cy.visit('/connect');
    cy.uploadWallet('empty');

    cy.visit('/swap');

    cy.get('[data-test="wallet-draw-button"]').click();

    cy.contains("Looks like you don't have anything in your wallet");

    cy.get('.ant-drawer-mask').click();

    cy.get(
      '.swap-list-view.desktop-view [data-test="swap-button-bnb"]',
    ).click();
    cy.get('[data-test="coincard-source-input"]').type('1000{enter}');

    cy.get('[data-test="coincard-source-input"]')
      .invoke('val')
      .should('equal', '0.00');

    cy.dragAndDrop('[data-test="source-asset"]', '[data-test="target-asset"]');

    cy.contains('Swap Invalid');
  });
});
