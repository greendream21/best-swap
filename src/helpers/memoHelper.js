export const getSingleSwapMemo = (symbol, addr, sliplimit = '', memo = '') => {
  return `swap:${symbol}:${addr}:${sliplimit}`;
};

export const getDoubleSwapMemo = (
  from,
  to,
  addr,
  sliplimit = '',
  memo = '',
) => {
  return `swap:${from}-${to}:${addr}:${sliplimit}`;
};
