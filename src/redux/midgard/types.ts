import { RemoteData } from '@devexperts/remote-data-ts';
import BigNumber from 'bignumber.js';
import { Maybe, FixmeType } from '../../types/bepswap';
import {
  AssetDetail,
  PoolDetail,
  StatsData,
  StakersAssetData,
  ThorchainEndpoints,
  ThorchainEndpoint,
  InlineResponse2001,
  TxDetailsTypeEnum,
  TotalVolChanges,
  PoolAggChanges,
  NetworkInfo,
} from '../../types/generated/midgard';

export type AssetDetailMap = {
  [asset: string]: AssetDetail;
};

export type PoolDataMap = {
  [symbol: string]: PoolDetail;
};

export type GetPoolDataPayload = {
  assets: string[];
  overrideAllPoolData: boolean;
  type?: 'simple' | 'full';
};

export type GetStakerPoolDataPayload = {
  asset: string;
  address: string;
};

export type StakerPoolData = {
  [symbol: string]: StakersAssetData;
};

export type PriceDataIndex = {
  [symbol: string]: BigNumber;
};

export type TxDetailType =
  | TxDetailsTypeEnum.Swap
  | TxDetailsTypeEnum.Stake
  | TxDetailsTypeEnum.Unstake
  | TxDetailsTypeEnum.DoubleSwap;

export type GetTransactionPayload = {
  offset: number;
  limit: number;
  asset?: string;
  type?: string;
};

export type GetTxByAddressPayload = {
  address: string;
  offset: number;
  limit: number;
  type?: string;
};

export type GetTxByAddressTxIdPayload = {
  address: string;
  txId: string;
  offset: number;
  limit: number;
  type?: string;
};

export type GetTxByAddressAssetPayload = {
  address: string;
  asset: string;
  offset: number;
  limit: number;
  type?: string;
};

export type GetTxByAssetPayload = {
  asset: string;
  offset: number;
  limit: number;
  type?: string;
};

export type GetRTVolumeByAssetPayload = {
  asset: string;
  from: number;
  to: number;
  interval: '5min' | 'hour' | 'day' | 'week' | 'month' | 'year';
  type?: string;
};

export type GetRTAggregateByAssetPayload = {
  asset: string;
  from: number;
  to: number;
  interval: '5min' | 'hour' | 'day' | 'week' | 'month' | 'year';
  type?: string;
};

export type GetPoolDetailByAssetPayload = {
  asset: string;
};

export type RTVolumeData = Array<TotalVolChanges>;
export type RTAggregateData = Array<PoolAggChanges>;

export type TxDetailData = RemoteData<Error, InlineResponse2001>;

export type ApiBasePathRD = RemoteData<Error, string>;

export type ThorchainData = {
  constants?: FixmeType;
  lastBlock?: FixmeType;
  mimir?: FixmeType;
};

export type State = {
  assets: AssetDetailMap;
  assetArray: AssetDetail[];
  pools: string[];
  stats: StatsData;
  poolAddressData: Maybe<ThorchainEndpoints>;
  bnbPoolAddress: Maybe<ThorchainEndpoint>;
  poolAddress: Maybe<string>;
  poolAddressLoading: boolean;
  poolData: PoolDataMap;
  poolDetailedData: PoolDataMap;
  stakerPoolData: Maybe<StakerPoolData>;
  stakerPoolDataLoading: boolean;
  stakerPoolDataError: Maybe<Error>;
  runePrice: number;
  basePriceAsset: string; // set base price asset as a RUNE
  priceIndex: PriceDataIndex;
  error: Maybe<Error>;
  poolLoading: boolean;
  assetLoading: boolean;
  poolDataLoading: boolean;
  poolDetailedDataLoading: boolean;
  statsLoading: boolean;
  txData: TxDetailData;
  refreshTxStatus: boolean;
  rtVolumeLoading: boolean;
  rtVolume: TotalVolChanges[];
  rtAggregateLoading: boolean;
  rtAggregate: TotalVolChanges[];
  txCurData: Maybe<InlineResponse2001>;
  apiBasePath: ApiBasePathRD;
  thorchain: ThorchainData;
  networkInfo: NetworkInfo;
  networkInfoLoading: boolean;
};
