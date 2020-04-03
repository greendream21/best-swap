import { RemoteData } from '@devexperts/remote-data-ts';
import BigNumber from 'bignumber.js';
import { Maybe } from '../../types/bepswap';
import {
  AssetDetail,
  PoolDetail,
  StakersAssetData,
  ThorchainEndpoints,
  ThorchainEndpoint,
  InlineResponse200,
  TxDetailsTypeEnum,
} from '../../types/generated/midgard';

export type AssetDetailMap = {
  [asset: string]: AssetDetail;
};

export type PoolDataMap = {
  [symbol: string]: PoolDetail;
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

export type TxDetailType = TxDetailsTypeEnum.Swap
 | TxDetailsTypeEnum.Stake | TxDetailsTypeEnum.Unstake
 | TxDetailsTypeEnum.Add | TxDetailsTypeEnum.Refund;

export type GetTxByAddressPayload = {
  address: string;
  offset: number;
  limit: number;
  type?: TxDetailType;
};

export type GetTxByAddressTxIdPayload = {
  address: string;
  txId: string;
  offset: number;
  limit: number;
  type?: TxDetailType;
};

export type GetTxByAddressAssetPayload = {
  address: string;
  asset: string;
  offset: number;
  limit: number;
  type?: TxDetailType;
};

export type GetTxByAssetPayload = {
  asset: string;
  offset: number;
  limit: number;
  type?: TxDetailType;
};

export type TxDetailData = RemoteData<Error, InlineResponse200>;

export type State = {
  assets: AssetDetailMap;
  assetArray: AssetDetail[];
  pools: string[];
  poolAddressData: Maybe<ThorchainEndpoints>;
  bnbPoolAddress: Maybe<ThorchainEndpoint>;
  poolAddress: Maybe<string>;
  poolData: PoolDataMap;
  stakerPoolData: Maybe<StakerPoolData>;
  stakerPoolDataLoading: boolean;
  stakerPoolDataError: Maybe<Error>;
  runePrice: number;
  basePriceAsset: string; // set base price asset as a RUNE
  priceIndex: PriceDataIndex;
  error: Maybe<Error>;
  poolLoading: boolean;
  txData: TxDetailData;
  apiBasePath: RemoteData<Error, string>;
};
