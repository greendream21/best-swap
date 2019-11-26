import axios from 'axios';

export const COINGECKO_API_URL = process.env.REACT_APP_COINGECKO_API_URL;
export const CHAINSERVICE_BASE_URL = process.env.REACT_APP_CHAINSERVICE_API_URL;
export const STATECHAIN_BASE_URL = process.env.REACT_APP_STATECHAIN_API_URL;
export const BINANCE_TESTNET_URL = process.env.REACT_APP_BINANCE_TESTNET_URL;
export const BINANCE_MAINNET_URL = process.env.REACT_APP_BINANCE_MAINNET_URL;
export const MIDGARD_API_URL = process.env.REACT_APP_MIDGARD_API_URL;
export const TESTNET_TX_BASE_URL = 'https://testnet-explorer.binance.org/tx/';

console.log('coingecko url ', COINGECKO_API_URL);
export const getChainserviceURL = url => `${CHAINSERVICE_BASE_URL}/${url}`;
export const getStatechainURL = url => `${STATECHAIN_BASE_URL}/${url}`;
export const getCoinGeckoURL = url => `${COINGECKO_API_URL}/${url}`;
export const getBinanceTestnetURL = url => `${BINANCE_TESTNET_URL}/${url}`;
export const getBinanceMainnetURL = url => `${BINANCE_MAINNET_URL}/${url}`;
export const getMidgardURL = url => `${MIDGARD_API_URL}/v1/${url}`;

const defaultAxios = axios.create();

export const axiosRequest = defaultAxios.request;

export const getHeaders = () => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return headers;
};
