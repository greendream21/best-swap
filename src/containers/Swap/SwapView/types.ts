export type PoolInfoType = {
  asset: string;
  target: string;
};

type RawSwapCardDataType = {
  depth: number;
  volume: number;
  transaction: number;
  slip: number;
  trade: number;
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

export type SwapTableRowType = {
  pool: PoolInfoType;
  depth: string;
  volume: string;
  transaction: string;
  slip: string;
  trade: string;
  key: number;
  raw: RawSwapCardDataType;
};

export enum SwapViewType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
}
