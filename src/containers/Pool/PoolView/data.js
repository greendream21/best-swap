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
  const volume = poolInfo.vol24hr;
  const transaction = Number(
    swapInfo.aveTxTkn * tokenPrice + swapInfo.aveTxRune * runePrice,
  );
  const roi = poolInfo.roiAT;
  const liqFee = Number(
    swapInfo.aveFeeTkn * tokenPrice + swapInfo.aveFeeRune * runePrice,
  );

  return {
    asset,
    target,
    depth,
    volume,
    transaction,
    liqFee,
    roi,
  };
};
