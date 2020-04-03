import * as url from 'url';
import axios, { AxiosResponse, Method } from 'axios';
import { DefaultApi } from '../types/generated/midgard';
import { Maybe, Nothing } from '../types/bepswap';

export const BINANCE_TESTNET_URL =
  process.env.REACT_APP_BINANCE_TESTNET_URL ||
  'https://testnet-dex.binance.org/api/v1';

export const BINANCE_MAINNET_URL =
  process.env.REACT_APP_BINANCE_MAINNET_URL || 'https://dex.binance.org/api/v1';

export const MIDGARD_DEV_API_DEV_IP =
  process.env.REACT_APP_MIDGARD_DEV_API_DEV_IP || '159.89.252.210';

export const TESTNET_TX_BASE_URL = 'https://testnet-explorer.binance.org/tx/';

export const TESTNET_SEED_URL =
  process.env.REACT_APP_TESTNET_SEED_URL ||
  'https://testnet-seed.thorchain.info/node_ip_list.json';

export const getBinanceTestnetURL = (url: string) =>
  `${BINANCE_TESTNET_URL}/${url}`;
export const getBinanceMainnetURL = (url: string) =>
  `${BINANCE_MAINNET_URL}/${url}`;

const defaultAxios = axios.create();

export const axiosRequest = defaultAxios.request;

export const getHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

export type TestnetSeedData = string[];

export enum Protocol {
  HTTP = 'http',
  HTTPS = 'https',
}
/**
 * Helper to create basePath for Midgard by given IP
 */
export const getMidgardBasePathByIP = (ip: string, protocol = Protocol.HTTP) =>
  `${protocol}://${ip}:8080`;

/**
 * Helper to get basePath for Midgard
 */
export const getMidgardBasePath = async (
  isTestnet: boolean,
  defaultIP = MIDGARD_DEV_API_DEV_IP,
) => {
  // On testnet we need to load IP from testnet seed
  if (isTestnet) {
    try {
      const response: AxiosResponse<TestnetSeedData> = await axiosRequest({
        method: 'get' as Method,
        url: TESTNET_SEED_URL,
        headers: getHeaders(),
      });
      const activeList = response?.data;
      if (activeList?.length) {
        // get ip from list randomly
        const index = Math.floor(Math.random() * (activeList.length - 1));
        const ip = activeList[index];
        return getMidgardBasePathByIP(ip);
      } else {
        return Promise.reject(
          new Error(`Could not parse 'active' IP from response: ${response}`),
        );
      }
    } catch (error) {
      return Promise.reject(
        new Error(
          `Could not load seed data from testnet seed url: ${TESTNET_SEED_URL}`,
        ),
      );
    }
  } else {
    return Promise.resolve(getMidgardBasePathByIP(defaultIP));
  }
};

/**
 * Helper to get `DefaultApi` instance for Midgard
 */

export const getMidgardDefaultApi = (basePath: string) =>
  new DefaultApi({ basePath });

/**
 * Helper to get `hostname` from url
 */
export const getHostnameFromUrl = (u: string): Maybe<string> => {
  const parsed = url.parse(u, true);
  return parsed?.hostname ?? Nothing;
};
