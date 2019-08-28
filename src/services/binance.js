import BnbClient from '@binance-chain/javascript-sdk';

class BinanceService {
  constructor() {
    this.baseURL = 'https://dex.binance.org';
    this.explorerBaseURL = 'https://explorer.binance.org';

    this.bnbClient = new BnbClient(this.baseURL);
  }

  isValidAddress = address => {
    return this.getCrypto().checkAddress(address);
  };

  getCrypto = () => {
    return BnbClient.crypto;
  };

  getLedger = () => {
    return BnbClient.ledger;
  };
}

export const binanceService = BinanceService;

export default new BinanceService();
