import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import querystring from 'querystring';

import { NET, isDevnet, isTestnet } from '../env';

class ChainService {
  constructor() {
    this.baseURL = 'http://api.bepswap.com';
    if (isTestnet) {
      this.baseURL = process.env.REACT_APP_CHAINSERVICE_API_URL;
    }

    this.net = NET;

    this.httpClient = axios.create({
      baseURL: this.baseURL,
      contentType: 'application/json',
    });

    if (isDevnet) {
      console.log('Using mock chain service');
      const mock = new MockAdapter(this.httpClient);

      mock.onAny().reply(config => {
        const url = new URL(config.url);
        const path = url.pathname;
        const q = querystring.parse(url.search.slice(1));
        console.log(path, q);

        if (path === '/health') {
          return [200, 'OK'];
        } else if (path === '/swapData') {
          if (q.asset === 'BNB') {
            return [
              200,
              {
                asset: 'BNB',
                aveTxTkn: 3,
                aveTxRune: 30,
                aveSlipTkn: 0.21,
                aveSlipRune: 0.22,
                numTxTkn: 786,
                numTxRune: 786,
                aveFeeTkn: 0.1,
                aveFeeRune: 1,
              },
            ];
          } else if (q.asset === 'TOMO') {
            return [
              200,
              {
                asset: 'TOMO',
                aveTxTkn: 4,
                aveTxRune: 40,
                aveSlipTkn: 0.31,
                aveSlipRune: 0.32,
                numTxTkn: 123,
                numTxRune: 1230,
                aveFeeTkn: 0.2,
                aveFeeRune: 2,
              },
            ];
          } else if (q.asset === 'BOLT') {
            return [
              200,
              {
                asset: 'BOLT',
                aveTxTkn: 5,
                aveTxRune: 50,
                aveSlipTkn: 0.41,
                aveSlipRune: 0.42,
                numTxTkn: 234,
                numTxRune: 2340,
                aveFeeTkn: 0.3,
                aveFeeRune: 3,
              },
            ];
          } else if (q.asset === 'ANKR') {
            return [
              200,
              {
                aveTxTkn: 6,
                aveTxRune: 60,
                aveSlipTkn: 0.51,
                aveSlipRune: 0.52,
                numTxTkn: 345,
                numTxRune: 3450,
                aveFeeTkn: 0.4,
                aveFeeRune: 4,
              },
            ];
          } else if (q.asset === 'FTM') {
            return [
              200,
              {
                asset: 'FTM',
                aveTxTkn: 7,
                aveTxRune: 70,
                aveSlipTkn: 0.61,
                aveSlipRune: 0.62,
                numTxTkn: 456,
                numTxRune: 4560,
                aveFeeTkn: 0.5,
                aveFeeRune: 5,
              },
            ];
          }
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
                depth: 5763.2496,
                poolUnits: 110.574,
                roiAT: 12.04,
                numStakers: 114,
                numStakeTx: 247,
                numSwaps: 25875,
              },
            ];
          } else if (q.asset === 'ANKR') {
            return [
              200,
              {
                asset: 'ANKR',
                totalFeesTKN: 1133.12,
                totalFeesRune: 1335.83123,
                vol24hr: 54.22,
                volAT: 66.23,
                depth: 23432.0449,
                poolUnits: 100.22,
                roiAT: 676.09,
                numStakers: 555,
                numStakeTx: 666,
                numSwaps: 88888,
              },
            ];
          } else if (q.asset === 'FTM') {
            return [
              200,
              {
                asset: 'FTM',
                totalFeesTKN: 10.12,
                totalFeesRune: 12.44,
                vol24hr: 1.11,
                volAT: 2.22,
                depth: 4444.4455,
                poolUnits: 100.01,
                roiAT: 99.0,
                numStakers: 44,
                numStakeTx: 77,
                numSwaps: 66,
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

  healthcheck = () => {
    return this.httpClient.get('/health');
  };

  stakerData = (bnb, symbol = '') => {
    const qs = querystring.stringify({ staker: bnb, asset: symbol });
    return this.httpClient.get('/stakerData?' + qs);
  };

  getPool = symbol => {
    const qs = querystring.stringify({ asset: symbol });
    return this.httpClient.get('/poolData?' + qs);
  };

  swapData = symbol => {
    const qs = querystring.stringify({ asset: symbol });
    return this.httpClient.get('/swapData?' + qs);
  };
}

const chain = new ChainService();
window.chain = chain;
export default chain;
