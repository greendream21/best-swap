import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import querystring from 'querystring';

import { NET, isDevnet, isTestnet } from '../env';

class StateChain {
  constructor() {
    this.baseURL = 'http://chain.bepswap.com:1317';
    if (isTestnet) {
      this.baseURL = 'http://testnet-chain.bepswap.com:1317';
    }

    this.net = NET;
    console.log('Net:', this.net);

    this.httpClient = axios.create({
      baseURL: this.baseURL,
      contentType: 'application/json',
    });

    if (isDevnet) {
      console.log('Using mock chain service');
      var mock = new MockAdapter(this.httpClient);

      mock.onAny().reply(config => {
        const url = new URL(config.url);
        const path = url.pathname;
        const q = querystring.parse(url.search.slice(1));
        console.log(path, q);

        if (path === '/swapservice/ping') {
          return [200, { ping: 'pong' }];
        } else if (path === '/swapservice/pools') {
          return [
            200,
            [
              {
                balance_rune: 67.36,
                balance_token: 23.539,
                ticker: 'BNB',
                pool_units: 23.6,
                pool_status: 'Enabled',
              },
              {
                balance_rune: 765.524,
                balance_token: 1756.879,
                ticker: 'TOMO',
                pool_units: 7562.77,
                pool_status: 'Suspended',
              },
              {
                balance_rune: 658.61,
                balance_token: 137.876,
                ticker: 'BOLT',
                pool_units: 34.68,
                pool_status: 'Enabled',
              },
              {
                balance_rune: 658.61,
                balance_token: 137.876,
                ticker: 'FTM',
                pool_units: 34.68,
                pool_status: 'Enabled',
              },
              {
                balance_rune: 658.61,
                balance_token: 137.876,
                ticker: 'ANKR',
                pool_units: 34.68,
                pool_status: 'Enabled',
              },
            ],
          ];
        } else {
          return [404, 'mock not implemented'];
        }
      });
    }
  }

  healthcheck() {
    return this.httpClient.get('/swapservice/ping');
  }

  listPools() {
    return this.httpClient.get('/swapservice/pools');
  }
}

var chain = (window.chain = new StateChain());
export default chain;
