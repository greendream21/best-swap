export const getSwapMemo = (symbol, addr, sliplimit = '') => {
  return `swap:${symbol}:${addr}:${sliplimit}`;
};

export const getStakeMemo = symbol => {
  return `stake:${symbol}`;
};

export const getCreateMemo = symbol => {
  return `create:${symbol}`;
};

export const getWithdrawMemo = (symbol, percent) => {
  return `withdraw:${symbol}:${percent}`;
};
