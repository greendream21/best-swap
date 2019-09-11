export const getSwapMemo = (symbol, addr, sliplimit = '', memo = '') => {
  return `SWAP:${symbol}:${addr}:${sliplimit}:${memo}`;
};
