import { useSelector } from 'react-redux';
import { bnOrZero } from '@thorchain/asgardex-util';
import {
  BaseAmount,
  baseAmount,
  formatBaseAsTokenAmount,
} from '@thorchain/asgardex-token';

import { RootState } from '../redux/store';
import { abbreviateNumberFromString } from '../helpers/numberHelper';

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
  };
};

export default useNetwork;
