// This script checks that our fixtures and naming conventions match a given swagger file

const runSwaggerFixtureTest = require('./swagger-fixture-tester');
const chalk = require('chalk');

async function main() {
  // TODO: Delete this once the swagger file is hosted
  console.log(
    '==============================================================\n',
  );

  console.log(
    chalk.yellow(
      `This is a reminder to edit the ${chalk.white(
        `./scripts/test-swagger.js`,
      )} script to point to the final swagger definitions once they are up.\n`,
    ),
  );

  console.log(
    chalk.yellow(
      `Currently this script is testing against a ${chalk.red(
        chalk.bold(`local file`),
      )} which it should not be doing.\n`,
    ),
  );
  console.log(chalk.yellow('PLEASE DELETE THIS MESSAGE'));
  console.log(
    '\n==============================================================',
  );
  // end delete this

  /**
   * Options:
   *   root             - (optional) resolved path to the project root.
   *   swaggerLocation  - local relative or remote location of swagger file to check against
   *   fixtureFolder    - folder containing fixtures `cypress/fixtures/{fixtureFolder}`
   */
  await runSwaggerFixtureTest({
    swaggerLocation:
      './scripts/swagger-fixture-tester/tmp-test-swagger-delete-me.json',
    fixtureFolder: 'api',
  });

  /*

  // Expect the above to be replaced with this when the API is ready:

  await runSwaggerFixtureTest({
    swaggerLocation: 'https://testnet-api.bepswap.net/v1/swagger.json',
    fixtureFolder: 'api',
  });

  await runSwaggerFixtureTest({
    swaggerLocation: 'https://testnet-chain.bepswap.net/v1/swagger.json',
    fixtureFolder: 'chain',
  });

  */
}

main();
