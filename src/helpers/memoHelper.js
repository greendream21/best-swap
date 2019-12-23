export const getSwapMemo = (symbol, addr, sliplimit = '') => {
  return `SWAP:${symbol}:${addr}:${sliplimit}`;
};

export const getStakeMemo = symbol => {
  return `STAKE:${symbol}`;
};

export const getCreateMemo = symbol => {
  return `STAKE:${symbol}`;
};

export const getWithdrawMemo = (symbol, percent) => {
  return `WITHDRAW:${symbol}:${percent}`;
};
