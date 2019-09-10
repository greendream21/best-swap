import axios from 'axios';
import bnbClient from '@binance-chain/javascript-sdk';
import TokenManagement from '@binance-chain/javascript-sdk';

import { NET, isTestnet } from '../env';

class Binance {
  constructor() {
    this.baseURL = 'https://dex.binance.org';
    this.explorerBaseURL = 'https://explorer.binance.org';
    if (isTestnet) {
      this.baseURL = 'https://testnet-dex.binance.org';
      this.explorerBaseURL = 'https://testnet-explorer.binance.org';
    }

    this.net = NET;
    console.log('Net:', this.net);

    this.httpClient = axios.create({
      baseURL: this.baseURL + '/api/v1',
      contentType: 'application/json',
    });

    this.bnbClient = new bnbClient(this.baseURL);
    this.bnbClient.chooseNetwork(this.net);
    this.bnbClient.initChain();
    this.bnbTokens = new TokenManagement(this.bnbClient).tokens;
  }

  setPrivateKey = privateKey => {
    this.bnbClient.setPrivateKey(privateKey);
    this.bnbClient.chooseNetwork(this.net);
    this.bnbClient.initChain();
  };

  useLedgerSigningDelegate = (
    ledgerApp,
    preSignCb,
    postSignCb,
    errCb,
    hdPath,
  ) => {
    return this.bnbClient.useLedgerSigningDelegate(
      ledgerApp,
      preSignCb,
      postSignCb,
      errCb,
      hdPath,
    );
  };

  clearPrivateKey = () => {
    this.bnbClient.privateKey = null;
  };

  getPrefix = () => {
    return isTestnet ? 'tbnb' : 'bnb';
  };

  txURL = tx => {
    return this.explorerBaseURL + '/tx/' + tx;
  };

  fees = () => {
    return this.httpClient.get('/fees');
  };

  price = async symbol => {
    const bnb = await axios.get(
      'https://api.cryptonator.com/api/ticker/bnb-usd',
    );
    const rune = await this.httpClient.get('/markets');
    const symbol_data = rune.data.find(s => {
      return s.base_asset_symbol === symbol;
    });
    return (
      parseFloat(bnb.data.ticker.price) * parseFloat(symbol_data.list_price)
    );
  };

  // convert fee number into BNB tokens
  calculateFee = x => {
    return x / 100000000;
  };

  getBalances = address => {
    return this.bnbClient.getBalance(address);
  };

  getAccount = address => {
    return this.bnbClient.getAccount(address);
  };

  getMarkets = (limit = 1000, offset = 0) => {
    return this.bnbClient.getMarkets(limit, offset);
  };

  multiSend = async (address, transactions, memo = '') => {
    // send coins!
    const result = await this.bnbClient.multiSend(address, transactions, memo);

    // clear private key from memory after each transaction
    this.clearPrivateKey();

    return result;
  };
}

var binance = (window.binance = new Binance());

export default binance;
