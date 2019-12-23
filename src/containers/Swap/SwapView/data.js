import { get as _get } from 'lodash';
import { getUserFormat } from '../../../helpers/stringHelper';

export const getSwapData = (from, poolInfo, runePrice) => {
  const asset = from;
  const target = _get(poolInfo, 'asset.ticker', '');
  const depth = Number(poolInfo.runeDepth);
  const volume = poolInfo.poolVolume24hr;
  const transaction = Number(poolInfo.poolTxAverage * runePrice);
  const slip = Number(poolInfo.poolSlipAverage * runePrice * 100);
  const trade = Number(poolInfo.swappingTxCount);

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
