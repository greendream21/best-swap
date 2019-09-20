export const getSwapData = (
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
  const slip = Number(
    ((swapInfo.aveSlipTkn * tokenPrice + swapInfo.aveSlipRune * runePrice) /
      2) *
      100,
  );
  const trade = Number(swapInfo.numTxTkn + swapInfo.numTxRune);

  return {
    asset,
    target,
    depth,
    volume,
    transaction,
    slip,
    trade,
  };
};
