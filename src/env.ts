import { binance } from 'asgardex-common';

const prod_hostnames = ['bepswap.com'];
const dev_hostnames = ['localhost'];

const hostname = window.location.hostname;

const isMainnet = prod_hostnames.includes(hostname);
const isTestnet = hostname.includes('testnet');
const isDevnet = dev_hostnames.includes(hostname);

const BINANCE_NET = isMainnet ? binance.Network.MAINNET : binance.Network.TESTNET;

export { BINANCE_NET, isDevnet, isTestnet, isMainnet };
