import { BaseAmount } from '@thorchain/asgardex-token';
import BigNumber from 'bignumber.js';

export enum TabKeys {
  ADD_SYM = 'ADD_SYM',
  ADD_ASYM = 'ADD_ASYM',
  WITHDRAW = 'WITHDRAW',
}

export type StakeData = {
  fromAddr: string;
  toAddr: string;
  toToken: string;
  runeAmount: BigNumber;
  tokenAmount: BigNumber;
};

export type WithdrawData = {
  runeValue: BaseAmount;
  tokenValue: BaseAmount;
  tokenPrice: BigNumber;
  percentage: number;
};
