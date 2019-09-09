import axios from 'axios';
import querystring from 'querystring';

class CoinGecko {
  constructor() {
    this.baseURL = 'https://api.coingecko.com';

    this.httpClient = axios.create({
      baseURL: this.baseURL + '/api/v3',
      contentType: 'application/json',
    });
  }

  listCoins() {
    return this.httpClient.get('/coins/list');
  }

  price(coin, currency = 'usd') {
    const qs = querystring.stringify({ ids: coin, vs_currencies: currency });
    return this.httpClient.get('/simple/price?' + qs);
  }
}

var coingecko = (window.coingecko = new CoinGecko());
export default coingecko;
