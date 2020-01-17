import { get as _get } from 'lodash';
import { getUserFormat } from '../../../helpers/stringHelper';

export const getSwapData = (from, poolInfo, priceIndex, basePriceAsset) => {
  const asset = from;
  const target = _get(poolInfo, 'asset.ticker', '');

  const runePrice = priceIndex.RUNE;
  const depth = Number(poolInfo.runeDepth) * runePrice;
  const volume = poolInfo.poolVolume24hr * runePrice;
  const transaction = Number(poolInfo.poolTxAverage * runePrice);
  const slip = Number(poolInfo.poolSlipAverage * runePrice);
  const trade = Number(poolInfo.swappingTxCount);

  const depthValue = `${basePriceAsset} ${getUserFormat(
    depth,
  ).toLocaleString()}`;
  const volumeValue = `${basePriceAsset} ${getUserFormat(volume)}`;
  const transactionValue = `${basePriceAsset} ${getUserFormat(transaction)}`;
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
