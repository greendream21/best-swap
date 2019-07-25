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
- `storybook`: run storybook for project
- `build-storybook`: build storybook into the dir `build/storybook`
- `deploy`: deploy the project on firebase
- `lint`: lint code with eslint rules
- `lint:watch` : lint watch mode
- `eject`: eject CRA (not recommended)

Example: `yarn start`

## Running the tests

- React unit test with jest/enzyme, react-test-renderer

```
yarn test
```

## Deployment

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

## Authors

- **Ben Cochane**

## License

MIT
