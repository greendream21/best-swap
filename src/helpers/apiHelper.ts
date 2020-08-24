import * as url from 'url';
import axios, { AxiosInstance } from 'axios';
import rateLimit from 'axios-rate-limit';

import { DefaultApi } from '../types/generated/midgard';
import { Maybe, Nothing } from '../types/bepswap';
import { envOrDefault } from './envHelper';
import { isMainnet } from '../env';

export const BINANCE_TESTNET_URL = envOrDefault(
  process.env.REACT_APP_BINANCE_TESTNET_URL,
  'https://testnet-dex.binance.org/api/v1',
);

export const BINANCE_MAINNET_URL = envOrDefault(
  process.env.REACT_APP_BINANCE_MAINNET_URL,
  'https://dex.binance.org/api/v1',
);

export const MIDGARD_TEST_API = envOrDefault(
  process.env.REACT_APP_MIDGARD_TEST_API,
  'https://midgard.bepswap.com',
);

export const MIDGARD_CHAOSNET_API = envOrDefault(
  process.env.REACT_APP_MIDGARD_CHAOSNET_API_URL,
  'https://chaosnet-midgard.bepswap.com',
);

export const getMidgardBaseURL = () => {
  return isMainnet ? MIDGARD_CHAOSNET_API : MIDGARD_TEST_API;
};

const THORCHAIN_API_URL = 'http://175.41.165.95:1317/thorchain';

export const getThorchainBaseURL = () => {
  return THORCHAIN_API_URL;
};

export const BINANCE_TX_BASE_URL = isMainnet
  ? 'https://explorer.binance.org/tx/'
  : 'https://testnet-explorer.binance.org/tx/';

export const getBinanceTestnetURL = (url: string) =>
  `${BINANCE_TESTNET_URL}/${url}`;
export const getBinanceMainnetURL = (url: string) =>
  `${BINANCE_MAINNET_URL}/${url}`;

const defaultAxios = axios.create();

export const axiosRequest = defaultAxios.request;

// create axios request for binance with api rate limit (1 request per second)
const binanceAxios = rateLimit(axios.create(), {
  maxRequests: 1,
  perMilliseconds: 1000,
}) as AxiosInstance;

export const binanceRequest = binanceAxios.request;

export const getHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

/**
 * Helper to get `DefaultApi` instance for Midgard
 */

export const getMidgardDefaultApi = (basePath: string) =>
  new DefaultApi({ basePath });

/**
 * Helper to get `hostname` from url
 */
export const getHostnameFromUrl = (u: string): Maybe<string> => {
  // we do need a runtime check here, TS can't help here, since u could be anything
  if (typeof u === 'string') {
    const parsed = url.parse(u, true);
    return parsed?.hostname ?? Nothing;
  }
  return Nothing;
};
