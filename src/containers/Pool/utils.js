import { getStakeMemo } from '../../helpers/memoHelper';

import {
  getFixedNumber,
  getBaseNumberFormat,
} from '../../helpers/stringHelper';

export const getPoolData = (
  from,
  to,
  poolInfo,
  swapInfo,
  assetData,
  runePrice,
) => {
  const tokenData = assetData.find(data => data.asset === to);
  const tokenPrice = tokenData ? tokenData.price : 0;

  const asset = from;
  const target = to.split('-')[0];
  const depth = Number(poolInfo.depth * runePrice);
  const volume24 = poolInfo.vol24hr;
  const volumeAT = poolInfo.volAT;
  const transaction = Number(
    swapInfo.aveTxTkn * tokenPrice + swapInfo.aveTxRune * runePrice,
  );
  const { roiAT } = poolInfo;
  const liqFee = Number(
    swapInfo.aveFeeTkn * tokenPrice + swapInfo.aveFeeRune * runePrice,
  );

  const totalSwaps = poolInfo.numSwaps;
  const totalStakers = poolInfo.numStakers;

  return {
    tokenPrice,
    asset,
    target,
    depth,
    volume24,
    volumeAT,
    transaction,
    liqFee,
    roiAT,
    totalSwaps,
    totalStakers,
  };
};

export const getCalcResult = (tokenName, pools, rValue, runePrice, tValue) => {
  let R = 10000;
  let T = 10;
  const Pr = runePrice;
  const result = {};

  pools.forEach(poolData => {
    const { balance_rune, balance_token, pool_address, symbol } = poolData;

    if (symbol.toLowerCase() === tokenName.toLowerCase()) {
      R = Number(balance_rune);
      T = Number(balance_token);
      result.poolAddressTo = pool_address;
      result.symbolTo = symbol;
    }
  });

  const r = getBaseNumberFormat(rValue);
  const t = getBaseNumberFormat(tValue);

  const poolPrice = getFixedNumber((R / T) * runePrice);
  const newPrice = getFixedNumber((runePrice * (r + R)) / (t + T));
  const newDepth = getFixedNumber(runePrice * (1 + (r / R + t / T) / 2) * R);
  const share = getFixedNumber(((r / (r + R) + t / (t + T)) / 2) * 100);

  return {
    ...result,
    poolPrice,
    newPrice,
    newDepth,
    share,
    Pr,
  };
};

export const validateStake = (wallet, runeAmount, tokenAmount, data) => {
  const { poolAddressTo } = data;
  if (!wallet || !poolAddressTo || !runeAmount || !tokenAmount) {
    return false;
  }
  return true;
};

export const confirmStake = (
  Binance,
  wallet,
  runeAmount,
  tokenAmount,
  data,
) => {
  return new Promise((resolve, reject) => {
    console.log('confirm stake', wallet, runeAmount, tokenAmount, data);

    if (!validateStake(wallet, runeAmount, tokenAmount, data)) {
      return reject();
    }

    const { poolAddressTo, symbolTo } = data;

    const memo = getStakeMemo(symbolTo);
    console.log('memo: ', memo);

    const outputs = [
      {
        to: poolAddressTo,
        coins: [
          {
            denom: 'RUNE-A1F',
            amount: runeAmount,
          },
          {
            denom: symbolTo,
            amount: tokenAmount,
          },
        ],
      },
    ];

    Binance.multiSend(wallet, outputs, memo)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};
