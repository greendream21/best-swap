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
      const X = Number(balance_rune);
      const Y = Number(balance_token);

      bnbPrice = X / Y;
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
export const getBepswapValues = (token, pools, bnbPrice) => {
  let poolPriceBNB = 0;
  let poolBuyDepth = 0;
  let poolSellDepth = 0;
  let X = 0;
  let Y = 0;
  let R = 0;
  let Z = 0;

  if (compareShallowStr(getTickerFormat(token), 'rune')) {
    pools.forEach(poolData => {
      const { symbol, balance_rune, balance_token } = poolData;

      if (compareShallowStr('bnb', symbol)) {
        X = Number(balance_token) / BASE_NUMBER;
        Y = Number(balance_rune) / BASE_NUMBER;

        const poolPriceToken = X / Y;
        poolPriceBNB = poolPriceToken / bnbPrice;
        poolBuyDepth = Y / bnbPrice;
        poolSellDepth = Y / poolPriceBNB;
      }
    });
  } else {
    pools.forEach(poolData => {
      const { symbol, balance_rune, balance_token } = poolData;

      if (compareShallowStr(getTickerFormat(symbol), 'bnb')) {
        X = Number(balance_token) / BASE_NUMBER;
        Y = Number(balance_rune) / BASE_NUMBER;
      }
      if (compareShallowStr(symbol, token)) {
        R = Number(balance_rune) / BASE_NUMBER;
        Z = Number(balance_token) / BASE_NUMBER;

        const poolPriceToken = R / Z;
        poolPriceBNB = poolPriceToken / bnbPrice;
        poolBuyDepth = R / bnbPrice;
        poolSellDepth = Z / poolPriceBNB;
      }
    });
  }

  return {
    poolPriceBNB,
    poolBuyDepth,
    poolSellDepth,
    X,
    Y,
    R,
    Z,
  };
};

/**
 * return priceDiff calc
 * @param {Number} marketPrice market price in BNB
 * @param {Number} poolPrice pool price in BNB
 */
export const getPriceDiff = (marketPrice, poolPrice) => {
  return (marketPrice - poolPrice) / poolPrice;
};

/**
 * return bnbToSell calc
 * @param {Number} priceDiff
 * @param {Object} data object of X, Y, R values
 */
export const getBnbToSell = (priceDiff, data) => {
  const { X, Y, R } = data;
  let bnbToSell = 0;

  if (Y > 0 && R > 0) {
    const minYR = Math.min(Y / R, 1);
    bnbToSell = ((priceDiff * R * X) / (5 * Y)) * minYR;
  } else {
    bnbToSell = (priceDiff / 4) * X;
  }

  return bnbToSell;
};
