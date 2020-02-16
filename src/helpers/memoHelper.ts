import { Maybe } from '../types/bepswap';

export const getSwapMemo = (
  symbol: Maybe<string>,
  addr: string,
  sliplimit = '',
) => {
  return `SWAP:${symbol}:${addr}:${sliplimit}`;
};

export const getStakeMemo = (symbol: string) => {
  return `STAKE:${symbol}`;
};

export const getCreateMemo = (symbol: string) => {
  return `STAKE:${symbol}`;
};

export const getWithdrawMemo = (symbol: string, percent: number) => {
  return `WITHDRAW:${symbol}:${percent}`;
};
