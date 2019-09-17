export const getSwapMemo = (symbol, addr, sliplimit = '') => {
  return `swap:${symbol}:${addr}:${sliplimit}`;
};
