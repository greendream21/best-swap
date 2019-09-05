import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import querystring from 'querystring';

import { NET, isDevnet, isTestnet } from '../env';

class ChainService {
  constructor() {
    this.baseURL = 'http://api.bepswap.com';
    if (isTestnet) {
      this.baseURL = 'http://testnet-api.bepswap.com';
    }

    this.net = NET;
    console.log('Net:', this.net);

    if (isDevnet) {
      console.log('Using mock chain service');
      var mock = new MockAdapter(axios);

      mock.onAny().reply(config => {
        const url = new URL(config.url);
        const path = url.pathname;
        const q = querystring.parse(url.search);

        if (path === '/health') {
          return [200, 'OK'];
        } else if (path === '/stakerData') {
          if (q.asset === '') {
            return [200, ['BNB', 'BOLT']];
          } else if (q.asset === 'BNB') {
            return [
              200,
              {
                asset: 'BNB',
                tokensStaked: 13.4,
                runeStaked: 45.789,
                target: 'rune',
              },
            ];
          } else if (q.asset === 'BOLT') {
            return [
              200,
              {
                asset: 'BOLT',
                tokensStaked: 68.073,
                runeStaked: 104.623,
                target: 'rune',
              },
            ];
          }
        } else {
          return [404, 'mock not implemented'];
        }
      });
    }

    this.httpClient = axios.create({
      baseURL: this.baseURL,
      contentType: 'application/json',
    });
  }

  healthcheck() {
    return this.httpClient.get('/health');
  }

  stakerData(bnb, ticker = '') {
    const qs = querystring.stringify({ staker: bnb, asset: ticker });
    return this.httpClient.get('/stakerData?' + qs);
  }
}

var chain = (window.chain = new ChainService());
export default chain;
