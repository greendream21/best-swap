import 'cypress-file-upload';

const WALLETS = {
  full: {
    fileName: 'wallet/fullwallet.txt',
    pass: 'AWQDoHpGf7L{qzV{',
    id: 'tbnb16hlvxuwq0ju92wghc6ms3kxf88e7aysw3l76zn',
  },
  empty: {
    fileName: 'wallet/emptywallet.txt',
    pass: 'AWQDoHpGf7L{qzV{',
    id: 'tbnb1s565tagxurhw2ew6ael6x3vaaunnlh7pv56trt',
  },
};

function mockWalletRoutes(type) {
  cy.route(
    'GET',
    'https://testnet-dex.binance.org/api/v1/markets?limit=1000&offset=0',
    'fx:wallet/markets',
  ).as('markets');

  if (type === 'full') {
    cy.route(
      'GET',
      `https://testnet-dex.binance.org/api/v1/account/${WALLETS[type].id}`,
      'fx:wallet/dex-account.full',
    ).as('dex-account.full');
  }

  if (type === 'empty') {
    cy.route({
      method: 'GET',
      url: `https://testnet-dex.binance.org/api/v1/account/${WALLETS[type].id}`,
      status: 404,
      response: '',
      force404: false, // bypass auto forcing 404
    });
  }
}

function getWalletPassword(type) {
  return WALLETS[type].pass;
}

Cypress.Commands.add('mockWalletRoutes', () => {
  mockWalletRoutes();
});

Cypress.Commands.add('getWalletPassword', (type = 'full') => {
  return getWalletPassword(type);
});

Cypress.Commands.add('uploadWallet', (type = 'full') => {
  const { fileName } = WALLETS[type];

  if (!fileName) throw new Error('Unknown wallet');

  // Upload the wallet
  mockWalletRoutes(type);
  cy.get('[data-test="add-wallet-button"]').click();

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

  cy.get('[data-test="keystore-password"]').type(getWalletPassword(type));
  cy.get('[data-test="keystore-submit"]').click();

  // We need to wait for the dust to settle when applying a wallet because of the way gitlab's
  // CPU is throttled. Because we are waiting on CPU we cannot wait on a request to return.
  // If we click immediately it causes a race condition that fails the tests.
  // Note this is not network latency but CPU throttling.
  // TODO: fix this
  // It may make sense to ensure this process is done synchronously before navigating away from
  // the upload page
  cy.wait(3000);
});
