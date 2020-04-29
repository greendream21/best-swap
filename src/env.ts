import { Network } from '@thorchain/asgardex-binance';

const prod_hostnames = ['bepswap.com'];
const dev_hostnames = ['localhost'];

const hostname = window.location.hostname;

const isMainnet = prod_hostnames.includes(hostname);
const isTestnet = hostname.includes('testnet');
const isDevnet = dev_hostnames.includes(hostname);

enum NET {
  DEV = 'devnet',
  TEST = 'testnet',
  MAIN = 'mainnet'
}

export const getNet = (): NET => {
  if (isMainnet) return NET.MAIN;
  if (isTestnet) return NET.TEST;
  return NET.DEV;
};

const BINANCE_NET = isMainnet ? Network.MAINNET : Network.TESTNET;

export { NET, BINANCE_NET, isDevnet, isTestnet, isMainnet };
