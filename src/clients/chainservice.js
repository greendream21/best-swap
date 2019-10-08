import axios from 'axios';
import querystring from 'querystring';

import { NET, isTestnet } from '../env';

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
