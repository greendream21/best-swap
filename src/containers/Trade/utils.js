import {
  getTickerFormat,
  getFixedNumber,
  getUserFormat,
} from '../../helpers/stringHelper';

export const getTradeData = (
  from,
  to,
  poolData,
  poolInfo,
  tokenInfo,
  runePrice,
  bnbPrice,
  marketPrice,
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
  const premium =
    poolPrice !== 0 ? getFixedNumber(marketPrice - poolPrice) / poolPrice : 0;
  const reward = getUserFormat((0.5 * Math.abs(premium) * depth) / bnbPrice);
  console.log(to, marketPrice, poolPrice, bnbPrice, reward);
  return {
    tokenPrice,
    asset,
    target,
    depth,
    poolPrice,
    premium,
    reward,
  };
};
