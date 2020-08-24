import * as url from 'url';
import axios, { AxiosInstance } from 'axios';
import rateLimit from 'axios-rate-limit';

import { DefaultApi } from '../types/generated/midgard';
import { Maybe, Nothing } from '../types/bepswap';
import { envOrDefault } from './envHelper';

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

export const TESTNET_TX_BASE_URL = 'https://testnet-explorer.binance.org/tx/';

export const TESTNET_SEED_URL = envOrDefault(
  process.env.REACT_APP_TESTNET_SEED_URL,
  'https://testnet-seed.thorchain.info/node_ip_list.json',
);

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

export type TestnetSeedData = string[];

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
