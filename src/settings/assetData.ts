import { isMainnet } from '../env';

type tokenData = {
  mainnet: string;
  testnet: string;
};

export const RUNE_SYMBOL = isMainnet ? 'RUNE-B1A' : 'RUNE-67C';
export const BUSD_SYMBOL = isMainnet ? 'BUSD-BD1' : 'BUSD-BAF';

export const tokenNames: { [key: string]: tokenData } = {
  BNB: {
    mainnet: 'BNB',
    testnet: 'BNB',
  },
  RUNE: {
    mainnet: 'RUNE-B1A',
    testnet: 'RUNE-67C',
  },
  LOK: {
    mainnet: 'LOKI-6A9',
    testnet: 'LOK-3C0',
  },
  LOKI: {
    mainnet: 'LOKI-6A9',
    testnet: 'LOK-3C0',
  },
  ERD: {
    mainnet: 'ERD-D06',
    testnet: 'ERD-D85',
  },
  FSN: {
    mainnet: 'FSN-E14',
    testnet: 'FSN-F1B',
  },
  FTM: {
    mainnet: 'FTM-A64',
    testnet: 'FTM-585',
  },
  TCAN: {
    mainnet: 'CAN-677',
    testnet: 'TCAN-014',
  },
  CAN: {
    mainnet: 'CAN-677',
    testnet: 'TCAN-014',
  },
  TOMOB: {
    mainnet: 'TOMOB-4BC',
    testnet: 'TOMOB-1E1',
  },
};
