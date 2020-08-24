import { TokenAmount } from '@thorchain/asgardex-token';
import BigNumber from 'bignumber.js';
import { Maybe } from '../../types/bepswap';
/**
 * Tx types
 */
export enum TxTypes {
  STAKE = 'stake',
  SWAP = 'swap',
  WITHDRAW = 'withdraw',
  CREATE = 'create',
}

// tx result can be object (for swap) or boolean (for stake and withdraw tx)
export type TxResult = {
  type?: string;
  amount?: string;
  token?: string;
  status?: boolean;
};

export type TxData = {
  sourceAsset: string; // symbol for source asset
  sourceAmount: TokenAmount;
  targetAsset: string; // symbol for target asset
  targetAmount: TokenAmount;
  slip?: BigNumber; // slip value if tx type is swap
};

export type TxStatus = {
  /**
   * Type of tx's - optional
   */
  readonly type?: TxTypes;
  /**
   *  Modal state
   * true -> `opened` modal
   * `false` -> `closed` modal
   */
  readonly modal: boolean;
  /**
   *  Current step value. It can be something between 0 - `MAX_VALUE` to show a progress of requests
   */
  readonly value: number;
  /**
   *  Start time of first request - undefined by default
   */
  readonly startTime?: number;
  /**
   * Status of `TxTimer` component (it could be any other component, too)
   * `true` -> `TxTimer` component is counting
   * `false` -> <TxTimer /> component is not counting
   */
  readonly status: boolean;
  /**
   * Transaction hash - optional
   */
  readonly hash?: string;
  /**
   * Transaction Info - ex: swap pair OR stake pool symbol
   */
  readonly info?: string;
  readonly txData: TxData;
};

/**
 * State of reducer
 */
export type State = {
  themeType: string;
  readonly txStatus: TxStatus;
  txResult?: Maybe<TxResult>;
};
