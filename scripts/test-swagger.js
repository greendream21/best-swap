// This script checks that our fixtures and naming conventions match a given swagger file

const runSwaggerFixtureTest = require('./swagger-fixture-tester');

async function main() {
  /**
   * Options:
   *   root             - (optional) resolved path to the project root.
   *   swaggerLocation  - local relative or remote location of swagger file to check against
   *   fixtureFolder    - folder containing fixtures `cypress/fixtures/{fixtureFolder}`
   */

  await runSwaggerFixtureTest({
    swaggerLocation: 'https://testnet-api.bepswap.net/v1/swagger.json',
    fixtureFolder: 'api',
  });

  /*

  // Expect the below to be replaced with this when the API is ready:

  await runSwaggerFixtureTest({
    swaggerLocation: 'https://testnet-chain.bepswap.net/v1/swagger.json',
    fixtureFolder: 'chain',
  });

  */
}

main();
