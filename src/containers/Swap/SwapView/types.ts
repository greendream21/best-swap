import BigNumber from 'bignumber.js';
import { PoolInfoType } from '../../Pool/types';

type RawSwapCardDataType = {
  depth: BigNumber;
  volume: BigNumber;
  transaction: BigNumber;
  slip: BigNumber;
  trade: BigNumber;
};

export type SwapCardType = {
  pool: PoolInfoType;
  depth: string;
  volume: string;
  transaction: string;
  slip: string;
  trade: string;
  raw: RawSwapCardDataType;
};

export type SwapTableRowType = SwapCardType & { key: number };
