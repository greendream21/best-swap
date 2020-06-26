import { Maybe } from '../types/bepswap';

const getAssetFormat = (symbol: Maybe<string>) => {
  return `BNB.${symbol}`;
};

export const getSwapMemo = (
  symbol: string,
  addr: string,
  sliplimit = '',
) => {
  return `SWAP:${getAssetFormat(symbol)}:${addr}:${sliplimit}`;
};

export const getStakeMemo = (symbol: string) => {
  return `STAKE:${getAssetFormat(symbol)}`;
};

export const getWithdrawMemo = (symbol: string, percent: number) => {
  return `WITHDRAW:${getAssetFormat(symbol)}:${percent}`;
};
