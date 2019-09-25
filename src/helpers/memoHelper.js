export const getSwapMemo = (symbol, addr, sliplimit = '') => {
  return `swap:${symbol}:${addr}:${sliplimit}`;
};

export const getStakeMemo = symbol => {
  return `stake:${symbol}`;
};
