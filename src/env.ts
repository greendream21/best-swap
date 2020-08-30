import {
  Client as binanceClient,
  BinanceClient,
} from '@thorchain/asgardex-binance';

const prod_hostnames = ['bepswap.com'];
const dev_hostnames = ['localhost'];

const hostname = window.location.hostname;

const isMainnet =
  process.env.REACT_APP_NET === 'mainnet' || prod_hostnames.includes(hostname);
const isTestnet =
  process.env.REACT_APP_NET === 'testnet' || hostname.includes('testnet');
const isChaosnet = hostname.includes('chaosnet');
const isDevnet = dev_hostnames.includes(hostname);

enum NET {
  DEV = 'devnet',
  TEST = 'testnet',
  CHAOS = 'chaosnet',
  MAIN = 'mainnet',
}

export const getNet = (): NET => {
  if (isMainnet) return NET.MAIN;
  if (isTestnet) return NET.TEST;
  if (isChaosnet) return NET.CHAOS;
  return NET.DEV;
};

const BINANCE_NET = isMainnet ? 'mainnet' : 'testnet';
const CHAIN_ID = isTestnet ? 'Binance-Chain-Nile' : 'Binance-Chain-Tigris';

export {
  NET,
  BINANCE_NET,
  CHAIN_ID,
  isDevnet,
  isTestnet,
  isChaosnet,
  isMainnet,
};

export const asgardexBncClient: BinanceClient = new binanceClient({
  network: BINANCE_NET,
});

export const bncClient = asgardexBncClient.getBncClient();
