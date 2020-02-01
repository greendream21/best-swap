import { FixmeType, Maybe, Address } from '../../types/bepswap';

export interface User {
  /**
   * Users wallet address
   * */
  wallet: Address;
  // TODO (veado) What exactly do we put into keystore?
  keystore: FixmeType;
}

export type EmptyUser = {}

export interface AssetData {
  asset: string;
  assetValue: number;
  price: number;
}

export type StakeData = FixmeType;

export interface State {
  user: Maybe<User>;
  assetData: AssetData[];
  stakeData: StakeData[];
  loadingAssets: boolean;
  loadingStakes: boolean;
  error: Maybe<Error>;
}

export interface GetUserStakeDataResult {
  targetSymbol: string;
  target: string;
  targetValue: number;
  assetValue: number;
  asset: string;
  price: number;
}
