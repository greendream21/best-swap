import { getTickerFormat, getUserFormat } from '../../../helpers/stringHelper';

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
  const target = getTickerFormat(to);
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

  const depthValue = `$${getUserFormat(depth).toLocaleString()}`;
  const volumeValue = `$${getUserFormat(volume)}`;
  const transactionValue = `$${getUserFormat(transaction)}`;
  const tradeValue = `${trade}`;

  return {
    pool: {
      asset,
      target,
    },
    depth: depthValue,
    volume: volumeValue,
    transaction: transactionValue,
    slip,
    trade: tradeValue,
    raw: {
      depth: getUserFormat(depth),
      volume: getUserFormat(volume),
      transaction: getUserFormat(transaction),
      slip,
      trade,
    },
  };
};
