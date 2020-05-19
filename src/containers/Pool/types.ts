import BigNumber from 'bignumber.js';

import { BaseAmount } from '@thorchain/asgardex-token';

export type PoolInfoType = {
  asset: string;
  target: string;
};

export type PoolDataValues = {
  pool: PoolInfoType;
  target: string;
  symbol: string;
  depth: string;
  volume24: string;
  transaction: string;
  liqFee: string;
  roiAT: string;
  poolPrice: string;
};

export type PoolDataRaw = {
  depth: BaseAmount;
  volume24: BaseAmount;
  transaction: BaseAmount;
  liqFee: BaseAmount;
  roiAT: number;
  poolPrice: BigNumber;
};

export type PoolData = {
  asset: string;
  target: string;
  depth: BaseAmount;
  volume24: BaseAmount;
  volumeAT: BaseAmount;
  transaction: BaseAmount;
  liqFee: BaseAmount;
  roiAT: number;
  poolROI12: BigNumber;
  totalSwaps: number;
  totalStakers: number;
  values: PoolDataValues;
  raw: PoolDataRaw;
};
