import {
  getTickerFormat,
  getFixedNumber,
  getUserFormat,
  compareShallowStr,
} from '../../helpers/stringHelper';
import { BASE_NUMBER } from '../../settings/constants';

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

/**
 * get bnb price from pools
 * @param {Array} pools pool data from the statechain
 * @return {String} price of bnb
 */
export const getBnbPrice = pools => {
  let bnbPrice = 0;

  pools.forEach(poolData => {
    const { symbol, balance_rune, balance_token } = poolData;

    if (compareShallowStr('bnb', symbol)) {
      const R = Number(balance_rune);
      const T = Number(balance_token);

      bnbPrice = R / T;
    }
  });

  return bnbPrice;
};

/**
 * Get prices for bepswap
 * @param {String} token symbol for token
 * @param {Array} pools pool data from the statechain
 * @return {Object} price values for bepswap
 */
export const getBepswapPrice = (token, pools, bnbPrice) => {
  let poolPriceBNB = 0;
  let poolBuyDepth = 0;
  let poolSellDepth = 0;

  pools.forEach(poolData => {
    const { symbol, balance_rune, balance_token } = poolData;

    if (compareShallowStr(token, symbol)) {
      const R = Number(balance_rune) / BASE_NUMBER;
      const T = Number(balance_token) / BASE_NUMBER;

      const poolPriceToken = R / T;
      poolPriceBNB = poolPriceToken / bnbPrice;
      poolBuyDepth = T / bnbPrice;
      poolSellDepth = T / poolPriceBNB;
    }
  });

  return {
    poolPriceBNB,
    poolBuyDepth,
    poolSellDepth,
  };
};
