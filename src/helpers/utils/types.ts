import BigNumber from 'bignumber.js';
import { TokenAmount, BaseAmount } from '@thorchain/asgardex-token';
import { FixmeType, Maybe } from '../../types/bepswap';

export type SwapData = {
  symbolFrom: string;
  symbolTo: string;
  Px: BigNumber;
  slip: BigNumber;
  outputAmount: TokenAmount;
  outputPrice: BigNumber;
  fee: TokenAmount;
  slipLimit: BaseAmount;
};

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
  roi: string;
  apy: string;
  runeStakedTotal: string;
  poolPrice: string;
};

export type PoolData = {
  pool: PoolInfoType;
  asset: string;
  target: string;
  depth: BaseAmount;
  volume24: BaseAmount;
  volumeAT: BaseAmount;
  transaction: BaseAmount;
  liqFee: BaseAmount;
  roi: number;
  apy: number;
  poolROI12: BigNumber;
  totalSwaps: number;
  totalStakers: number;
  runeStakedTotal: BaseAmount;
  poolPrice: BigNumber;
  values: PoolDataValues;
};

export type BncResponse = Maybe<{
  result: FixmeType;
  status: number;
}>;
