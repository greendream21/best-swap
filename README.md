# BEPSwap React Front-End

BEPSwap is UniSwap for BinanceChain. It will be the first go-to market product for THORChain and makes some compromises as to infrastructure and trustlessness. It will only swap BNB and BEP2 assets on Binance Chain using a second layer protocol that moves assets around on BNB accounts.

## Project Setup

### Project stack:

- React / Redux / Redux-Saga
- Ant Design
- Styled-components
- React-Intl
- Storybook
- Jest / Enzyme for Unit Test
- ESLint / Prettier for Code Linting
- GitLab CI
- Firebase Hosting

### Prerequisites

```
yarn
node v8^
firebase-tools
```

### Env variables

Create `.env` file and set the following variables.

```
REACT_APP_CHAINSERVICE_API_URL = http://xxx
REACT_APP_STATECHAIN_API_URL = http://xxx
```

### Project Setup

```
yarn install
yarn start
```

### npm scripts

- `fblogin`: firebase login
- `start`: run in development mode
- `build`: build react project
- `test`: unit test with jest / enzyme
- `test:all`: Run entire test suite
- `test:unit`: unit test with jest / enzyme
- `test:feat`: build the project and run all feature tests
- `cy:run`: run cypress tests in isolation
- `storybook`: run storybook for project
- `build-storybook`: build storybook into the dir `build/storybook`
- `deploy`: deploy the project on firebase
- `lint`: lint code with eslint rules
- `lint:watch` : lint watch mode
- `eject`: eject CRA (not recommended)

Example: `yarn start`

## Running the tests

To run the entire test suite

```bash
yarn test:all
```

### Unit testing with jest

```bash
yarn test:unit
```

1. Run all unit tests with jest/enzyme, react-test-renderer

### Feature testing with cypress

To build the project and run all feature tests

```bash
yarn test:feat
```

1. Create a new build
1. Launch test server on http://localhost:8080 with a simple non-production ready file server
1. Run feature tests over the build at http://localhost:8080

### Run feature tests over specific url

To run feature tests against a server set the `CYPRESS_baseUrl` env var:

```bash
CYPRESS_baseUrl=https://testnet.bepswap.net yarn cy:run
```

The default is `http://localhost:8080`

1. Run feature tests pointing to given url

## Deployment using firebase

Firebase deploy:

```
yarn deploy
```

## CI/CD

GitLab CI

- Test
- Deploy

Main Branch:

- master

## Internationalization

- [React-Intl](https://github.com/formatjs/react-intl) - React Internationalization Library.

## Code standard

- [React Airbnb code standard](https://github.com/airbnb/javascript/tree/master/react)
- [Prettier](https://prettier.io/)

## Built With

- [React](https://reactjs.org) - React.JS
- [Redux](https://github.com/reduxjs/redux) - For react global state management
- [Styled-components](https://www.styled-components.com/) - Style framework
- [Storybook](https://storybook.js.org/) - Storybook UI for building components
- [firebase](https://firebase.google.com/) - FaaS
