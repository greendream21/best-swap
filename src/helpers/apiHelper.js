import axios from 'axios';

export const BINANCE_TESTNET_URL = process.env.REACT_APP_BINANCE_TESTNET_URL;
export const BINANCE_MAINNET_URL = process.env.REACT_APP_BINANCE_MAINNET_URL;
export const MIDGARD_API_URL = process.env.REACT_APP_MIDGARD_API_URL;
export const TESTNET_TX_BASE_URL = 'https://testnet-explorer.binance.org/tx/';

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
