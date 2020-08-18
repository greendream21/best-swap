import React from 'react';
import ReactDOM from 'react-dom';
import BigNumber from 'bignumber.js';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './settings/appStyle/global.css';
import { DEFAULT_BN_FORMAT } from './settings/constants';

// Set default format - it can be updated in future (i18n)
BigNumber.config({ FORMAT: DEFAULT_BN_FORMAT });

// disable all console logs in the production
const noop = () => {};
if (process.env.NODE_ENV !== 'development') {
  console.log = noop;
  console.warn = noop;
  console.error = noop;
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//
