const prod_hostnames = ['bepswap.com'];
const dev_hostnames = ['localhost'];

const isMainnet = prod_hostnames.includes(window.location.hostname);
const isTestnet = !isMainnet;
const isDevnet = dev_hostnames.includes(window.location.hostname);

const NET = isTestnet ? 'testnet' : 'mainnet';
const CHAIN_ID = isTestnet ? 'Binance-Chain-Nile' : 'Binance-Chain-Tigris';

export { NET, CHAIN_ID, isDevnet, isTestnet, isMainnet };
