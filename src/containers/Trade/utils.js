import { getTickerFormat } from '../../helpers/stringHelper';

export const getTradeData = (
  from,
  to,
  poolInfo,
  swapInfo,
  tokenInfo,
  runePrice,
) => {
  const tokenData = tokenInfo[to];
  const tokenPrice = tokenData ? tokenData.price : 0;

  const asset = from;
  const target = getTickerFormat(to);
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
