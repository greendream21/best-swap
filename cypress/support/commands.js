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

function mockCoingeckoRoutes() {
  cy.route(
    'GET',
    'https://api.coingecko.com/api/v3//simple/price?ids=thorchain&vs_currencies=usd',
    'fx:coingecko/coingecko',
  ).as('coingecko');
}

function mockBaseRoutes() {
  // This mocks all the base routes
  // Override for each test case with a specific override
  cy.route('GET', '/swapservice/pools', 'fx:base/pools').as('pools');
  cy.route('GET', '/poolData?asset=BNB', 'fx:base/pool-bnb').as('pool-bnb');
  cy.route('GET', '/poolData?asset=FSN-F1B', 'fx:base/pool-fsn').as('pool-fsn');
  cy.route('GET', '/poolData?asset=TCAN-014', 'fx:base/pool-tcan').as(
    'pool-tcan',
  );
  cy.route('GET', '/poolData?asset=TOMOB-1E1', 'fx:base/pool-tomob').as(
    'pool-tomob',
  );
  cy.route('GET', '/poolData?asset=FTM-585', 'fx:base/pool-ftm').as('pool-ftm');
  cy.route('GET', '/poolData?asset=LOK-3C0', 'fx:base/pool-lok').as('pool-lok');
  cy.route('GET', '/swapData?asset=FSN-F1B', 'fx:base/swap-fsn').as('swap-fsn');
  cy.route('GET', '/swapData?asset=BNB', 'fx:base/swap-bnb').as('swap-bnb');
  cy.route('GET', '/swapData?asset=FTM-585', 'fx:base/swap-ftm').as('swap-ftm');
  cy.route('GET', '/swapData?asset=LOK-3C0', 'fx:base/swap-lok').as('swap-lok');
  cy.route('GET', '/swapData?asset=TOMOB-1E1', 'fx:base/swap-tomob').as(
    'swap-tomob',
  );
  cy.route('GET', '/swapData?asset=TCAN-014', 'fx:base/swap-tcan').as(
    'swap-tcan',
  );
  cy.route('GET', '/tokens', 'fx:base/tokens').as('tokens');
  cy.route('GET', '/tokens?token=BNB', 'fx:base/token-bnb').as('token-bnb');
  cy.route('GET', '/tokens?token=FSN-F1B', 'fx:base/token-fsn').as('token-fsn');
  cy.route('GET', '/tokens?token=FTM-585', 'fx:base/token-ftm').as('token-ftm');
  cy.route('GET', '/tokens?token=LOK-3C0', 'fx:base/token-lok').as('token-lok');
  cy.route('GET', '/tokens?token=TCAN-014', 'fx:base/token-tcan').as(
    'token-tcan',
  );
  cy.route('GET', '/tokens?token=TOMOB-1E1', 'fx:base/token-tomob').as(
    'token-tomob',
  );
  cy.route(
    'GET',
    '/stakerData?staker=tbnb1uf4hln238vmpk366fjrhf3het8slwdxj0h74s3&asset=',
    'fx:base/staked-tokens',
  ).as('staked-tokens');
}

function mockChainRoutes() {
  cy.route(
    'GET',
    'https://testnet-dex.binance.org/api/v1/node-info',
    'fx:chain/node-info',
  ).as('node-info');
  cy.route(
    'POST',
    'https://testnet-dex.binance.org/api/v1/broadcast?sync=true',
    'fx:chain/broadcast',
  ).as('broadcast');
}

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

Cypress.Commands.add('mockCoingeckoRoutes', () => {
  mockCoingeckoRoutes();
});

Cypress.Commands.add('mockWalletRoutes', () => {
  mockWalletRoutes();
});

Cypress.Commands.add('mockBaseRoutes', () => {
  mockBaseRoutes();
});

Cypress.Commands.add('mockChainRoutes', () => {
  mockChainRoutes();
});

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

const WALLET_PASS = 'AWQDoHpGf7L{qzV{';
Cypress.Commands.add('getWalletPassword', () => {
  return WALLET_PASS;
});
Cypress.Commands.add('uploadWallet', () => {
  // Upload the wallet
  mockWalletRoutes();
  cy.get('[data-test="add-wallet-button"]').click();
  const fileName = 'wallet/fullwallet.txt';
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

// This is in order to ensure unmocked routes cause a test to fail
// It escapes hotloading urls as they are ubiquitous when working off dev
// Not sure why this is not an optino in cypress in the first place
Cypress.Commands.overwrite('server', (originalFn, options) => {
  // Lets escape the dev hotloading url
  const isDevHotloadingUrl = url => url.match(/localhost:3000\/sockjs-node/);
  return originalFn(
    Object.assign(
      {
        force404: true,
        onAnyRequest: (route, proxy) => {
          const { xhr } = proxy;
          if (!isDevHotloadingUrl(xhr.url) && route.status === 404) {
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                throw new Error(
                  `Route not stubbed: 
        ${xhr.url}
     Please use cy.route() to allow or stub the url. ie:
       To allow:  'cy.route("${xhr.url}");'
       To stub:   'cy.route("${xhr.url}", "fx:myfixture");'`,
                );
              }
            };
          }
        },
      },
      options,
    ),
  );
});
