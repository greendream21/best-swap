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

        if (path === '/health') {
          return [200, 'OK'];
        } else if (path === '/poolData') {
          if (q.asset === 'BNB') {
            return [
              200,
              {
                asset: 'BNB',
                totalFeesTKN: 23.457,
                totalFeesRune: 17.356,
                vol24hr: 1.33,
                volAT: 10.23,
                depth: 1765.8365,
                poolUnits: 16475,
                roiAT: 11.12,
                numStakers: 13,
                numStakeTx: 25,
                numSwaps: 457,
              },
            ];
          } else if (q.asset === 'TOMO') {
            return [
              200,
              {
                asset: 'TOMO',
                totalFeesTKN: 67.457,
                totalFeesRune: 43.356,
                vol24hr: 2.33,
                volAT: 12.23,
                depth: 2864.8365,
                poolUnits: 233.03,
                roiAT: 9.17,
                numStakers: 45,
                numStakeTx: 114,
                numSwaps: 1756,
              },
            ];
          } else if (q.asset === 'BOLT') {
            return [
              200,
              {
                asset: 'BOLT',
                totalFeesTKN: 113.56,
                totalFeesRune: 135.83465,
                vol24hr: 26.33,
                volAT: 13.23,
                depth: 5763.296,
                poolUnits: 110.574,
                roiAT: 12.04,
                numStakers: 114,
                numStakeTx: 247,
                numSwaps: 25875,
              },
            ];
          }
        } else if (path === '/stakerData') {
          if (q.asset === '') {
            return [200, ['BNB', 'BOLT']];
          } else if (q.asset === 'BNB') {
            if (q.staker.length > 0) {
              return [
                200,
                {
                  asset: 'BNB',
                  tokensStaked: 13.4,
                  runeStaked: 45.789,
                  units: 24.99,
                  runeEarned: 12.33,
                  tokensEarned: 3.45,
                  target: 'rune',
                },
              ];
            } else {
              return [
                200,
                {
                  asset: 'BNB',
                  tokensStaked: 13.4,
                  runeStaked: 45.789,
                  target: 'rune',
                },
              ];
            }
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
  }

  healthcheck() {
    return this.httpClient.get('/health');
  }

  stakerData(bnb, ticker = '') {
    const qs = querystring.stringify({ staker: bnb, asset: ticker });
    return this.httpClient.get('/stakerData?' + qs);
  }

  getPool(ticker) {
    const qs = querystring.stringify({ asset: ticker });
    return this.httpClient.get('/poolData?' + qs);
  }
}

var chain = (window.chain = new ChainService());
export default chain;
