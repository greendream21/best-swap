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
  asset: AssetDetail;
  dateCreated: number;
  logo: string;
  name: string;
  priceRune: number;
}

export interface AssetDataIndex {
  [asset: string]: AssetData;
}

export interface PoolDataMap {
  [symbol: string]: PoolData;
}

export interface PoolData {
  asset: AssetDetail;
  assetDepth: number;
  assetROI: number;
  assetStakedTotal: number;
  buyAssetCount: number;
  buyFeeAverage: number;
  buyFeesTotal: number;
  buySlipAverage: number;
  buyTxAverage: number;
  buyVolume: number;
  poolDepth: number;
  poolFeeAverage: number;
  poolFeesTotal: number;
  poolROI: number;
  poolROI12: number;
  poolSlipAverage: number;
  poolStakedTotal: number;
  poolTxAverage: number;
  poolUnits: number;
  poolVolume: number;
  poolVolume24hr: number;
  price: number;
  runeDepth: number;
  runeROI: number;
  runeStakedTotal: number;
  sellAssetCount: number;
  sellFeeAverage: number;
  sellFeesTotal: number;
  sellSlipAverage: number;
  sellTxAverage: number;
  sellVolume: number;
  stakeTxCount: number;
  stakersCount: number;
  stakingTxCount: number;
  status: number;
  swappersCount: number;
  swappingTxCount: number;
  withdrawTxCount: number;
}

export interface GetStakerPoolDataPayload {
  asset: string;
  address: string;
}

export interface PoolAddressData {
  chain: string;
  pub_key: string;
  address: string;
}
export interface GetPoolAddressSuccessData {
  current: PoolAddressData[];
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
