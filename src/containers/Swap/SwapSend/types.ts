import { Maybe } from '../../../types/bepswap';

export enum SwapSendView {
  DETAIL = 'detail',
  SEND = 'send',
}

export type SwapData = {
  source?: string;
  target?: string;
};

export type CalcResult = {
  poolAddressFrom?: string;
  poolAddressTo?: string;
  symbolFrom?: string;
  symbolTo?: string;
  poolRatio?: number;
  Px: number;
  slip: number;
  outputAmount: number;
  outputPrice: number;
  fee: number;
  lim?: number;
};

export type Pair = {
  source: Maybe<string>;
  target: Maybe<string>;
};
