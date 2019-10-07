import axios from 'axios';

import { NET, isTestnet } from '../env';

class StateChain {
  constructor() {
    this.baseURL = 'http://chain.bepswap.com:1317';
    if (isTestnet) {
      this.baseURL = process.env.REACT_APP_STATECHAIN_API_URL;
    }

    this.net = NET;
    console.log('Net:', this.net);

    this.httpClient = axios.create({
      baseURL: this.baseURL,
      contentType: 'application/json',
    });
  }

  healthcheck() {
    return this.httpClient.get('/swapservice/ping');
  }

  listPools() {
    return this.httpClient.get('/swapservice/pools');
  }
}

const chain = new StateChain();
window.chain = chain;
export default chain;
