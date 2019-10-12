// This is an experiemental script waiting for the swagger json to be ready

const Ajv = require('ajv');
const axios = require('axios');
const RefParser = require('json-schema-ref-parser');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const glob = require('glob-promise');

// Utility function for nice errors
function formatError(fixtureInfo, message, err) {
  return `

=================================
  VALIDATION FAILURE
=================================

The following fixture failed validation:

${JSON.stringify(fixtureInfo, null, 2)}

${message}

${err || ''}
`;
}

function validatePath(validator, spec, requestPath, status, body) {
  const statusCode = spec.responses[status];

  // HACK: Following might be a little fragile seems
  //      like the spec is a little loose feel free to edit
  const schema =
    'schema' in statusCode
      ? statusCode.schema
      : statusCode.content['application/json'].schema;

  if (!body) return;

  if (schema) {
    if (!validator.validate(schema, body)) {
      throw new Error(
        'Response from ' +
          requestPath +
          ' failed validation: [' +
          validator.errorsText() +
          ']\n Response:' +
          JSON.stringify(body),
      );
    }
  } else if (body.length) {
    // From swagger specifications: "If this field(statusCode.schema) does not exist,
    // it means no content is returned as part of the response"
    throw new Error(
      'Received non-empty response from ' +
        requestPath +
        '. Expected empty response body because no "schema" property was specified in swagger path.',
    );
  }
}

function getFixtureInfo(filePath) {
  const [server, pathEncoded, method, fileName] = filePath.split('/');
  try {
    const [_, status, tag] = fileName.match(/(\d+)\.?(.*)?\.json$/);

    return {
      server,
      path: pathEncoded.replace(/#/g, '/'),
      method,
      status: Number(status),
      tag,
      filePath,
    };
  } catch (e) {
    throw new Error(`${filePath} is an invalid filePath`);
  }
}

// Run the validation on the given fixture
function validateFixture(validator, swaggerSpec, fixtureInfo) {
  const { path: pathName, method: upperCaseMethod, status, body } = fixtureInfo;
  const method = upperCaseMethod.toLowerCase();
  let spec;
  try {
    spec = swaggerSpec.paths[pathName][method];
  } catch (specError) {
    const possiblePaths = Object.keys(swaggerSpec.paths);
    const message = `Cannot find specification entry for pathName: "${pathName}" with http method "${method}"

Valid paths:

${possiblePaths.map(thing => ' ' + thing + '\n').join('')}

`;
    throw new Error(formatError(fixtureInfo, message));
  }

  try {
    validatePath(validator, spec, pathName, status, body);
  } catch (validationError) {
    const message = `Fixture failed the following specification within the swagger file: 

${JSON.stringify(spec, null, 2)}`;
    throw new Error(formatError(fixtureInfo, message, validationError));
  }
}

// Load all the fixtures based no the provided fixtureFolders array
const getFixtures = root => async fixtureFolders => {
  const fixtureGlob =
    fixtureFolders.length > 1
      ? `{${fixtureFolders.join(',')}}`
      : fixtureFolders[0];
  const cwd = path.resolve(root, `./cypress/fixtures`);
  const files = await glob(`${fixtureGlob + '/' || ''}**/*.json`, {
    cwd,
  });

  const fileContents = await Promise.all(
    files.map(
      fileName =>
        new Promise((res, rej) => {
          fs.readFile(path.resolve(cwd, fileName), (err, data) => {
            if (err) {
              rej(err);
            }
            res(JSON.parse(data));
          });
        }),
    ),
  );

  return files.map(getFixtureInfo).map((info, i) => ({
    ...info,
    body: fileContents[i],
  }));
};

function pathIsLocal(path) {
  return path.indexOf('.') === 0;
}

// Load a remote swagger file
async function remoteFetcher(swaggerLocation) {
  const { data } = await axios({
    url: swaggerLocation,
    method: 'get',
  });
  return data;
}

// Load a local swagger file
const localFetcher = projectRoot => async swaggerLocation => {
  const data = JSON.parse(
    fs.readFileSync(path.resolve(projectRoot, swaggerLocation)),
  );

  return Promise.resolve(data);
};

// run the tester
module.exports = async function run({
  root = path.resolve(__dirname, '../../'),
  fixtureFolder,
  swaggerLocation,
}) {
  // Try and load swagger file remote or local
  const fetcher = pathIsLocal(swaggerLocation)
    ? localFetcher(root)
    : remoteFetcher;
  let fileContents;
  try {
    fileContents = await fetcher(swaggerLocation);
  } catch (e) {
    console.log(chalk.red(e));
  }

  // Setup our validator
  const validator = new Ajv({
    unknownFormats: [
      'int32',
      'int64',
      'float',
      'double',
      'byte',
      'binary',
      'date',
      'password',
    ],
  });

  // Parse our swagger file
  const swaggerSpec = await RefParser.dereference(fileContents);

  // Get all our fixtures
  const fixtureFetcher = getFixtures(root);
  const apiFixtures = await fixtureFetcher([fixtureFolder]);

  // Start testing
  console.log(
    `\nTesting that our fixtures match the swagger validation at:\n\n ${swaggerLocation} \n\n`,
  );

  try {
    apiFixtures.forEach(fixtureInfo => {
      validateFixture(validator, swaggerSpec, fixtureInfo);
      // If we make it here we are all good
      console.log(`${chalk.white(fixtureInfo.filePath)} ${chalk.green(`✓`)}`);
    });
  } catch (err) {
    // Report the crash
    console.log(chalk.red(err));
    process.exit(1);
  }
};
