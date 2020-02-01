import { Maybe } from '../../types/bepswap';

export interface PoolDetail {
  chain: string;
  symbol: string;
}

export interface AssetDetail {
  chain: string;
  symbol: string;
  ticker: string;
}

export interface AssetData {
  asset: AssetDetail,
  dateCreated: number,
  logo: string,
  name: string,
  priceRune: number
}

export interface AssetDataIndex {
  [asset: string]: AssetData;
}

export interface PoolDataMap {
  [symbol: string]: PoolData;
}

export interface PoolData {
  asset?: { symbol?: string };
}

export interface GetStakerPoolDataPayload {
  asset: string;
  address: string;
}

export interface PoolAddressData {
  chain: string,
  pub_key: string,
  address: string
}
export interface GetPoolAddressSuccessData {
    current: PoolAddressData[]
}

export interface StakerPoolData {
  [symbol: string]: PoolData;
}

export interface PriceDataIndex {
  [symbol: string]: number;
}

export interface AddressData {
  chain: string;
  address: string;
}

export interface State {
  assets: AssetDataIndex;
  assetArray: AssetData[];
  pools: PoolData[];
  poolAddressData: Maybe<GetPoolAddressSuccessData>;
  bnbPoolAddress: Maybe<AddressData>;
  poolAddress: Maybe<string>;
  poolData: PoolDataMap;
  stakerPoolData: StakerPoolData;
  runePrice: number;
  basePriceAsset: string; // set base price asset as a RUNE
  priceIndex: PriceDataIndex;
  error: Maybe<Error>;
  poolLoading: boolean;
  stakerPoolDataLoading: boolean;
}
