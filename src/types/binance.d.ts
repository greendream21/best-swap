/**
 * Types for Binance SDK
 *
 * Note:
 * Currently there are no TS types for Binance JS SDK.
 * So we have to define by ourself or to generate these later
 * See "TS types support for TS apps" https://github.com/binance-chain/javascript-sdk/issues/194
 * */

type TxHash = string; // TODO(veado): Define a proper type
type Address = string; // TODO(veado): Define a proper type

interface Asset {
  /**
   * Asset symbol
   */
  a: string;
  /**
   * Asset value
   */
  A: string;
}

type Assets = Asset[];

interface Trade {
  /**
   * Receiver address
   */
  o: Address;
  /**
   * Asset to trade
   */
  c: Assets;
}

type Trades = Trade[];

interface TransferEventData {
  /**
   * Payload name ??
   */
  e: string;
  /**
   * ???
   */
  E: number;
  /**
   * Tx hash
   */
  H: TxHash;
  /**
   * Memo
   */
  M: string;
  /**
   * Sender address
   */
  f: Address;
  t: Trades;
}
/**
 * Payload of a transfer event
 * https://docs.binance.org/api-reference/dex-api/ws-streams.html#3-transfer
 */
interface TransferEvent {
  /**
   * Name of the event
   */
  stream: string;
  /**
   * Event payload
   */
  data?: TransferEventData;
}

//
// See https://github.com/binance-chain/javascript-sdk/wiki/API#get-balances
interface Balance {
  symbol: string;
  free: string;
}

interface Market {
  base_asset_symbol: string;
  list_price: string;
  lot_size: string;
  quote_asset_symbol: string;
  tick_size: string;
}

interface StakePool {
  chain: string;
  symbol: string;
  ticker: string;
}
