import { getTickerFormat, getFixedNumber } from '../../helpers/stringHelper';

export const getTradeData = (
  from,
  to,
  poolData,
  poolInfo,
  swapInfo,
  tokenInfo,
  runePrice,
) => {
  const tokenData = tokenInfo[to];
  const tokenPrice = tokenData ? tokenData.price : 0;

  const asset = from;
  const target = getTickerFormat(to);

  const { balance_rune, balance_token } = poolData;

  const R = Number(balance_rune);
  const T = Number(balance_token);
  const poolPrice = getFixedNumber((R / T) * runePrice);
  const depth = Number(poolInfo.depth * runePrice);

  const totalSwaps = poolInfo.numSwaps;
  const totalStakers = poolInfo.numStakers;

  return {
    tokenPrice,
    asset,
    target,
    depth,
    poolPrice,
    totalSwaps,
    totalStakers,
  };
};
