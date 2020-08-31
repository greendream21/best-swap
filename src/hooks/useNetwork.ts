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
  const maxStakeRuneValue = `${formatBaseAsTokenAmount(maxStakeRuneAmount)}`;

  const totalStakedAmount: BaseAmount = baseAmount(
    bnOrZero(networkInfo?.totalStaked),
  );
  const totalStakedValue = `${formatBaseAsTokenAmount(totalStakedAmount)}`;

  const globalRuneStakeStatus: string = `${totalStakedValue} / ${maxStakeRuneValue} RUNE Staked`;

  // totalStake / maxStake < 95%
  const isValidFundCaps: boolean = totalStakedAmount
    .amount()
    .dividedBy(maxStakeRuneAmount.amount())
    .isLessThan(0.95);

  return {
    totalStakedAmount,
    maxStakeRuneAmount,
    globalRuneStakeStatus,
    isValidFundCaps,
  };
};

export default useNetwork;
