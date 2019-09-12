export const getSwapMemo = (symbol, addr, sliplimit = '', memo = '') => {
  return `=:${symbol}:${addr}:${sliplimit}:${memo}`;
};

export const getDoubleSwapMemo = (
  from,
  to,
  addr,
  sliplimit = '',
  memo = '',
) => {
  return `=:${from}-${to}:${addr}:${sliplimit}:${memo}`;
};
