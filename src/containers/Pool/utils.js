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

export const getCalcResult = (from, to, pools, rValue, runePrice) => {
  let R = 10000;
  let T = 10;
  const Pr = runePrice;
  let result = {};

  pools.forEach(poolData => {
    const { balance_rune, balance_token, pool_address, ticker } = poolData;

    const token = ticker.split('-')[0];

    if (token.toLowerCase() === to.toLowerCase()) {
      R = Number(balance_rune);
      T = Number(balance_token);
      result.poolAddressTo = pool_address;
      result.tickerTo = ticker;
    }
  });

  const poolPrice = (R / T) * runePrice;

  // const calcData = { X, Y, R, Z, Py, Pr: Py };

  // const zValue = getZValue(xValue, calcData).toFixed(2);
  // const slip = getSlip(xValue, calcData);
  // const Px = getPx(xValue, calcData);
  // const Pz = getPz(xValue, calcData).toFixed(2);

  return {
    ...result,
    poolPrice,
    Pr,
  };
};
