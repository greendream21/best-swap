import BigNumber from 'bignumber.js';
import { Maybe } from '../../../types/bepswap';
import { TokenAmount, BaseAmount } from '../../../types/token';

export enum SwapSendView {
  DETAIL = 'detail',
  SEND = 'send',
}

export type SwapData = {
  source?: string;
  target?: string;
};

export type CalcResult = {
  poolAddressFrom: Maybe<string>;
  poolAddressTo: Maybe<string>;
  symbolFrom: Maybe<string>;
  symbolTo: Maybe<string>;
  Px: BigNumber;
  slip: BigNumber;
  outputAmount: TokenAmount;
  outputPrice: BigNumber;
  fee: TokenAmount;
  lim: Maybe<BaseAmount>;
};
