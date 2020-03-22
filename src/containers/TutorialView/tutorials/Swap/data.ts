// import { SingleSwapCalcData } from '../../../Swap/calc';

import BigNumber from 'bignumber.js';
import { TokenAmount } from '../../../../types/token';
import { bn } from '../../../../helpers/bnHelper';
import { tokenAmount } from '../../../../helpers/tokenHelper';

type SwapCalcData = {
  X: TokenAmount
  Y: TokenAmount
  Px: BigNumber
}

export const data: SwapCalcData = {
  X: tokenAmount(1000000),
  Y: tokenAmount(1000),
  Px: bn(0.04),
};
