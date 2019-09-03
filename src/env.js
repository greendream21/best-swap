const prod_hostnames = ['bepswap.com'];

const isMainnet = prod_hostnames.includes(window.location.hostname);
const isTestnet = !isMainnet;

const NET = isTestnet ? 'testnet' : 'mainnet';
const CHAIN_ID = isTestnet ? 'Binance-Chain-Nile' : 'Binance-Chain-Tigris';

export { NET, CHAIN_ID, isTestnet, isMainnet };
