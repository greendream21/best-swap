import showNotification from 'components/uielements/notification';

import { TxStatus, TxTypes, TxResult } from 'redux/app/types';

import { Maybe } from 'types/bepswap';

import { getTickerFormat } from './stringHelper';

export const showTxFinishNotification = (
  txStatus: TxStatus,
  txResult: Maybe<TxResult>,
) => {
  const {
    type,
    txData: { sourceAsset, targetAsset, sourceAmount, targetAmount },
  } = txStatus;
  const sourceTicker = getTickerFormat(sourceAsset).toUpperCase();
  const targetTicker = getTickerFormat(targetAsset).toUpperCase();
  let description;

  if (
    type === TxTypes.SWAP ||
    type === TxTypes.STAKE ||
    type === TxTypes.WITHDRAW
  ) {
    if (type === TxTypes.SWAP) {
      if (txResult?.type === 'refund') {
        description = `${sourceTicker} -> ${targetTicker} Swap is refunded!`;
      } else {
        description = `${sourceTicker} -> ${targetTicker} Swap is completed!`;
      }
    } else if (type === TxTypes.STAKE) {
      if (
        sourceAmount.amount().isGreaterThan(0) &&
        targetAmount.amount().isGreaterThan(0)
      ) {
        description = `${sourceTicker}, ${targetTicker}`;
      } else if (sourceAmount.amount().isGreaterThan(0)) {
        description = sourceTicker;
      } else if (targetAmount.amount().isGreaterThan(0)) {
        description = targetTicker;
      }
      description += ' Add Liquidity is completed!';
    } else if (type === TxTypes.WITHDRAW) {
      description = `${sourceTicker}, ${targetTicker} Withdraw is completed!`;
    }
    showNotification({
      type: 'success',
      message: 'Transaction Completed!',
      description,
    });
  }
};
