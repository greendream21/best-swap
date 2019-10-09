// Cypress needs a clearSessionStorage command https://github.com/cypress-io/cypress/issues/413
Cypress.Commands.add('clearSessionStorage', () => {
  cy.window().then(win => {
    win.sessionStorage.clear();
  });
});

// In order to enforce best practices this is provided
// This is in order to ensure unmocked routes cause a test to fail
// It escapes hotloading urls as they are ubiquitous when working off dev
Cypress.Commands.overwrite('server', (originalFn, options) => {
  // Escape hatch for e2e tests cy.server({ e2e:true })
  if (options) {
    const { e2e, ...opts } = options;
    if (e2e) {
      return originalFn(opts);
    }
  }
  // Lets escape the dev hotloading url
  const isDevHotloadingUrl = url => url.match(/localhost:3000\/sockjs-node/);
  return originalFn(
    Object.assign(
      {
        force404: true,
        onAnyRequest: (route, proxy) => {
          const { xhr } = proxy;
          // console.log('checkingRoute:', { route, proxy });
          if (
            !isDevHotloadingUrl(xhr.url) &&
            route.is404 &&
            route.status === 404
          ) {
            console.log('errorFailedRoute:', { route, proxy });
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                throw new Error(
                  `Route not stubbed: 
        ${xhr.url}
     Please use cy.route() to allow or stub the url. ie:

       To stub (recommended):  'cy.route("${xhr.url}", "fx:myfixture");'
       To allow (not recommended):  'cy.route("${xhr.url}");'

     It is best to stub all API requests as otherwise our 
     tests will become non deterministic.

     ----------------

     This check is configured under "cypress/support/commands.utils.js"
     To disable this check for an entire test (only recommended in e2e testing) call server with the following config:

       cy.server({ e2e: true });

`,
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
