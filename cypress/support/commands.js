// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

require('cypress-file-upload');

Cypress.Commands.add('dragAndDrop', (draggableSelector, droppableSelector) => {
  // convert to macro
  cy.get(droppableSelector).then(selection => {
    const [element] = selection;
    const coords = element.getBoundingClientRect();
    cy.get(draggableSelector)
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 10, clientY: 0 })
      .trigger('mousemove', {
        clientX: coords.x + 10,
        clientY: coords.y + 10,
      })
      .trigger('mouseup');
  });
});

function mockWalletRoutes() {
  cy.route(
    'GET',
    'https://testnet-dex.binance.org/api/v1/markets?limit=1000&offset=0',
    'fx:wallet/markets',
  ).as('markets');

  cy.route(
    'GET',
    'https://testnet-dex.binance.org/api/v1/account/tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
    'fx:wallet/dex-account',
  ).as('dex-account');
}

Cypress.Commands.add('mockWalletRoutes', () => {
  mockWalletRoutes();
});

const WALLET_PASS = 'AWQDoHpGf7L{qzV{';
Cypress.Commands.add('getWalletPassword', () => {
  return WALLET_PASS;
});
Cypress.Commands.add('uploadWallet', () => {
  // Upload the wallet
  mockWalletRoutes();
  cy.get('[data-test="add-wallet-button"]').click();
  const fileName = 'swap/fullwallet.txt';
  cy.fixture(fileName).then(fileContent => {
    // Unfortunately react-file-picker does not spread
    // props so we cannot reference it any other way that is stable
    // side effect is that we can only have a single file picker on
    // the page which should probably be ok
    cy.get('input[type=file]').upload({
      fileContent,
      fileName,
      mimeType: 'application/json',
    });
  });

  cy.get('[data-test="keystore-password"]').type(WALLET_PASS);
  cy.get('[data-test="keystore-submit"]').click();
});

// Cypress needs a clearSessionStorage command https://github.com/cypress-io/cypress/issues/413
Cypress.Commands.add('clearSessionStorage', () => {
  cy.window().then(win => {
    win.sessionStorage.clear();
  });
});
