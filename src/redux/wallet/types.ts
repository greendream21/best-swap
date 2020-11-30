import { RemoteData } from '@devexperts/remote-data-ts';
import { TokenAmount } from '@thorchain/asgardex-token';

import { FixmeType, Maybe, Address } from 'types/bepswap';

export type WalletType = 'keystore' | 'walletconnect' | 'ledger';

export interface User {
  /**
   * Users wallet address
   * */
  type: WalletType;
  wallet: Address;
  keystore?: FixmeType;
  ledger?: FixmeType;
  hdPath?: number[];
  walletConnector?: FixmeType;
}

export type EmptyUser = Record<string, never>;

export interface AssetData {
  asset: string;
  assetValue: TokenAmount;
}

export type StakeDataListLoadingState = RemoteData<Error, AssetData[]>;

export interface State {
  readonly user: Maybe<User>;
  readonly assetData: AssetData[];
  readonly stakeData: StakeDataListLoadingState;
  readonly loadingAssets: boolean;
  readonly error: Maybe<Error>;
}
