import BigNumber from 'bignumber.js';
import { BaseAmount } from '@thorchain/asgardex-token';

export enum ShareDetailTabKeys {
  ADD = 'add',
  WITHDRAW = 'withdraw',
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
