import { useSelector } from 'react-redux';
import { bnOrZero } from '@thorchain/asgardex-util';
import {
  BaseAmount,
  baseAmount,
  formatBaseAsTokenAmount,
} from '@thorchain/asgardex-token';

import { RootState } from '../redux/store';

const useNetwork = () => {
  const { networkInfo, thorchain: thorchainData } = useSelector(
    (state: RootState) => state.Midgard,
  );

  const { mimir } = thorchainData;

  const maxStakeRuneAmount: BaseAmount = baseAmount(
    bnOrZero(mimir?.['mimir//MAXIMUMSTAKERUNE']),
  );
  const maxStakeRuneAmountBN = maxStakeRuneAmount.amount();
  const maxStakeRuneValue = maxStakeRuneAmountBN.isEqualTo(0)
    ? 'Unlimited'
    : `${formatBaseAsTokenAmount(maxStakeRuneAmount)}`;

  const totalStakedAmount: BaseAmount = baseAmount(
    bnOrZero(networkInfo?.totalStaked),
  );
  const totalStakedValue = `${formatBaseAsTokenAmount(totalStakedAmount)}`;

  const globalRuneStakeStatus = `${totalStakedValue} / ${maxStakeRuneValue} RUNE Staked`;

  // totalStake / maxStake < 90% OR maxStakeRuneAmount is 0
  const isValidFundCaps: boolean =
    maxStakeRuneAmountBN.isEqualTo(0) ||
    totalStakedAmount
      .amount()
      .dividedBy(maxStakeRuneAmountBN)
      .isLessThan(0.9);

  return {
    totalStakedAmount,
    maxStakeRuneAmount,
    globalRuneStakeStatus,
    isValidFundCaps,
  };
};

export default useNetwork;
