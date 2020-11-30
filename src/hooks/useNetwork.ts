import { useSelector } from 'react-redux';

import {
  BaseAmount,
  baseAmount,
  formatBaseAsTokenAmount,
} from '@thorchain/asgardex-token';
import { bnOrZero } from '@thorchain/asgardex-util';


import { RootState } from 'redux/store';

import { abbreviateNumberFromString } from 'helpers/numberHelper';

export enum QueueLevel {
  GOOD = 'GOOD', // queue < 10
  SLOW = 'SLOW', // 10 < queue < 30
  BUSY = 'BUSY', // 30 < queue
}

const QUEUE_BUSY_LEVEL = 30;
const QUEUE_SLOW_LEVEL = 10;

const useNetwork = () => {
  const { networkInfo, thorchain: thorchainData } = useSelector(
    (state: RootState) => state.Midgard,
  );

  const { mimir, queue } = thorchainData;

  const outboundQueue = Number(queue?.outbound ?? 0);

  const getQueueLevel = (queueValue: number) => {
    if (queueValue > QUEUE_BUSY_LEVEL) return QueueLevel.BUSY;
    if (queueValue > QUEUE_SLOW_LEVEL) return QueueLevel.SLOW;
    return QueueLevel.GOOD;
  };

  const outboundQueueLevel: QueueLevel = getQueueLevel(outboundQueue);
  const isOutboundBusy = outboundQueueLevel === QueueLevel.BUSY;
  const isOutboundDelayed =
    outboundQueueLevel === QueueLevel.BUSY ||
    outboundQueueLevel === QueueLevel.SLOW;

  const getOutboundBusyTooltip = () => {
    return 'The network is currently experiencing delays signing outgoing transactions.';
  };

  type StatusColor = 'primary' | 'warning' | 'error';

  const statusColors: {
    [key: string]: StatusColor;
  } = {
    GOOD: 'primary',
    SLOW: 'warning',
    BUSY: 'error',
  };
  const statusColor: StatusColor = statusColors[outboundQueueLevel];

  const maxStakeRuneAmount: BaseAmount = baseAmount(
    bnOrZero(mimir?.['mimir//MAXIMUMSTAKERUNE']),
  );
  const maxStakeRuneAmountBN = maxStakeRuneAmount.amount();
  const maxStakeRuneValue = maxStakeRuneAmountBN.isEqualTo(0)
    ? 'Unlimited'
    : `${formatBaseAsTokenAmount(maxStakeRuneAmount)}`;
  const shortMaxStakeRuneValue = maxStakeRuneAmountBN.isEqualTo(0)
    ? 'Unlimited'
    : `${abbreviateNumberFromString(
        formatBaseAsTokenAmount(maxStakeRuneAmount, 2),
      )}`;

  const totalStakedAmount: BaseAmount = baseAmount(
    bnOrZero(networkInfo?.totalStaked),
  );
  const totalStakedValue = `${formatBaseAsTokenAmount(totalStakedAmount)}`;
  const shortTotalShakedValue = `${abbreviateNumberFromString(
    formatBaseAsTokenAmount(totalStakedAmount, 2),
  )}`;

  const globalRuneStakeStatus = `${totalStakedValue} / ${maxStakeRuneValue} RUNE Pooled`;
  const shortGlobalRuneStakeStatus = `${shortTotalShakedValue} / ${shortMaxStakeRuneValue} RUNE Pooled`;

  // totalStake / maxStake < 95% OR maxStakeRuneAmount is 0
  const isValidFundCaps: boolean =
    maxStakeRuneAmountBN.isEqualTo(0) ||
    totalStakedAmount
      .amount()
      .dividedBy(maxStakeRuneAmountBN)
      .isLessThan(0.95);

  return {
    totalStakedAmount,
    maxStakeRuneAmount,
    globalRuneStakeStatus,
    shortGlobalRuneStakeStatus,
    isValidFundCaps,
    QueueLevel,
    outboundQueueLevel,
    isOutboundDelayed,
    isOutboundBusy,
    statusColor,
    getOutboundBusyTooltip,
  };
};

export default useNetwork;
