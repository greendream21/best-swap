import { RemoteData } from '@devexperts/remote-data-ts';
import { FixmeType, Maybe, Address } from '../../types/bepswap';

export interface User {
  /**
   * Users wallet address
   * */
  wallet: Address;
  // TODO (veado) What exactly do we put into keystore?
  keystore: FixmeType;
}

export type EmptyUser = {};

export interface AssetData {
  asset: string;
  assetValue: number;
  price: number;
}

export type StakeData = {
  targetSymbol: string;
  target: string;
  targetValue: number;
  assetValue: number;
  asset: string;
  price: number;
};

export type StakeOrAssetData = AssetData | StakeData;

/**
 * Custom type guard to check StakeData
 */
export const isStakeData = (v: StakeOrAssetData): v is StakeData =>
  (v as StakeData).targetSymbol !== undefined &&
  (v as StakeData).targetValue !== undefined &&
  (v as StakeData).target !== undefined;

export type StakeDataListLoadingState = RemoteData<Error, StakeData[]>;

export interface State {
  readonly user: Maybe<User>;
  readonly assetData: AssetData[];
  readonly stakeData: StakeDataListLoadingState;
  readonly loadingAssets: boolean;
  readonly error: Maybe<Error>;
}
