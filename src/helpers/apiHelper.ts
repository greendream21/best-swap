import axios from 'axios';

export const BINANCE_TESTNET_URL =
  process.env.REACT_APP_BINANCE_TESTNET_URL ||
  'https://testnet-dex.binance.org/api/v1';
export const BINANCE_MAINNET_URL =
  process.env.REACT_APP_BINANCE_MAINNET_URL || 'https://dex.binance.org/api/v1';
export const MIDGARD_API_URL =
  process.env.REACT_APP_MIDGARD_API_URL ||
  window.location.protocol + '//' + window.location.hostname + ':8080';
export const TESTNET_TX_BASE_URL = 'https://testnet-explorer.binance.org/tx/';

export const getBinanceTestnetURL = (url: string) => `${BINANCE_TESTNET_URL}/${url}`;
export const getBinanceMainnetURL = (url: string) => `${BINANCE_MAINNET_URL}/${url}`;
export const getMidgardURL = (url: string) => `${MIDGARD_API_URL}/v1/${url}`;

const defaultAxios = axios.create();

export const axiosRequest = defaultAxios.request;

export const getHeaders = () => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return headers;
};
