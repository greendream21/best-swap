import { binance } from 'asgardex-common';

const prod_hostnames = ['bepswap.com'];
const dev_hostnames = ['localhost'];

const hostname = window.location.hostname;

const isMainnet = prod_hostnames.includes(hostname);
const isTestnet = hostname.includes('testnet');
const isDevnet = dev_hostnames.includes(hostname);

export enum NET {
  DEV = 'devnet',
  TEST = 'testnet',
  MAIN = 'mainnet'
}

export const getNet = (): NET => {
  if (isMainnet) return NET.MAIN;
  if (isTestnet) return NET.TEST;
  return NET.DEV;
};

const BINANCE_NET = isMainnet ? binance.Network.MAINNET : binance.Network.TESTNET;

export { BINANCE_NET, isDevnet, isTestnet, isMainnet };
