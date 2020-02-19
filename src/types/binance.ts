/**
 * Types for Binance SDK
 *
 * Note:
 * Currently there are no TS types for Binance JS SDK.
 * So we have to define by ourself or to generate these later
 * See "TS types support for TS apps" https://github.com/binance-chain/javascript-sdk/issues/194
 * */

/**
 * Token
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#token
 */
export type Token = {
  /**
   * token name, e.g. Binance Chain
   */
  name: string;
  /**
   * unique token trade symbol, e.g. BTC-000
   */
  symbol: string;
  /**
   * token symbol, e.g. BTC
   */
  original_symbol: string;
  /**
   * total token supply in decimal form, e.g. 1.00000000
   */
  total_supply: string;
  /**
   * Address which issue the token
   */
  owner: string;
};

/**
 * Market
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#market
 */
export type Market = {
  /**
   * symbol of base asset, e.g. BNB
   */
  base_asset_symbol: string;
  /**
   * symbol of quote asset, e.g. ABC-5CA
   */
  quote_asset_symbol: string;
  /**
   * Price in decimal form, e.g. 1.00000000
   */
  list_price: string;
  /**
   * Minimium price change in decimal form, e.g. 0.00000001
   */
  tick_size: string;
  /**
   * Minimium trading quantity in decimal form, e.g. 1.00000000
   */
  lot_size: string;
};

/**
 * TickerStatistics
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#tickerstatistics
 */
export type TickerStatistics = {
  /**
   * sell price
   */
  askPrice: string;
  /**
   * sell quantity
   */
  askQuantity: string;
  /**
   * buy price
   */
  bidPrice: string;
  /**
   * buy quantity
   */
  bidQuantity: string;
  /**
   * time of closing
   */
  closeTime: number;
  /**
   * total trade count
   */
  count: number;
  /**
   * ID of first trade
   */
  firstId: string;
  /**
   * highest price
   */
  highPrice: string;
  /**
   * ID of last trade
   */
  lastId: string;
  /**
   * last price
   */
  lastPrice: string;
  /**
   * last quantity
   */
  lastQuantity: string;
  /**
   * lowest price
   */
  lowPrice: string;
  /**
   * open price
   */
  openPrice: string;
  /**
   * open time
   */
  openTime: number;
  /**
   * last close price
   */
  prevClosePrice: string;
  /**
   * change of price
   */
  priceChange: string;
  /**
   * change of price in percentage
   */
  priceChangePercent: string;
  /**
   * trading volume in quote asset
   */
  quoteVolume: string;
  /**
   * trading symbol
   */
  symbol: string;
  /**
   * trading volume
   */
  volume: string;
  /**
   * weighted average price
   */
  weightedAvgPrice: string;
};

/**
 * Account
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#account
 */
export type Account = {
  /**
   * Account number
   */
  account_number: number;
  /**
   * Address of the account
   */
  address: Address;
  /**
   * List of balances
   */
  balances: [Balance];
  /**
   * Public key bytes
   */
  public_key: [number];
  /**
   * sequence is for preventing replay attack
   */
  sequence: number;
};

/**
 * TxPage
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#txpage
 */
export type TxPage = {
  /**
   * total sum of transactions
   */
  total: number;
  /**
   * List of transactions
   */
  tx: [Tx];
};

/**
 * Tx
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#tx
 */
export type Tx = {
  /**
   * block height
   */
  blockHeight: number;
  /**
   * transaction result code
   */
  code: number;
  /**
   * _no offical description_
   */
  confirmBlocks: number;
  /**
   * _no offical description_
   */
  data: string;
  /**
   * From address
   */
  fromAddr: Address;
  /**
   * Order ID
   */
  orderId: string;
  /**
   * Time of transaction
   */
  timeStamp: number;
  /**
   * To address
   */
  toAddr: Address;
  /**
   * _no offical description_
   */
  txAge: number;
  /**
   * _no offical description_
   */
  txAsset: string;
  /**
   * _no offical description_
   */
  txFee: string;
  /**
   * hash of transaction
   */
  txHash: string;
  /**
   * Type of transaction
   */
  txType: string;
  /**
   * Value of transaction
   */
  value: string;
  /**
   * _no offical description_
   */
  source: number;
  /**
   * _no offical description_
   */
  sequence: number;
  /**
   * Optional. Available when the transaction type is one of HTL_TRANSFER, CLAIM_HTL, REFUND_HTL, DEPOSIT_HTL
   */
  swapId?: string;
  /**
   * _no offical description_
   */
  proposalId: string;
};

/**
 * OrderList
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#orderlist
 */
export type OrderList = {
  /**
   * total sum of orders
   */
  total: number;
  /**
   * List of orders
   */
  order: [Order];
};

/**
 * Order status as part of an order
 * See description of Order.status for more detail https://docs.binance.org/api-reference/dex-api/paths.html#order
 */
export enum OrderStatus {
  Ack = 'Ack',
  PartialFill = 'PartialFill',
  IocNoFill = 'IocNoFill',
  FullyFill = 'FullyFill',
  Canceled = 'Canceled',
  Expired = 'Expired',
  FailedBlocking = 'FailedBlocking',
  FailedMatching = 'FailedMatching',
  IocExpire = 'IocExpire',
}

/**
 * Order
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#order
 */
export type Order = {
  /**
   * total amount of trades that have made
   */
  cumulateQuantity: string;
  /**
   * trading fee on the latest updated block of this order. Multiple assets are split by semicolon.
   */
  fee: string;
  /**
   * price of last execution
   */
  lastExecutedPrice: string;
  /**
   * quantity of last execution
   */
  lastExecutedQuantity: string;
  /**
   * time of order creation
   */
  orderCreateTime: number;
  /**
   * Order ID
   */
  orderId: string;
  /**
   * order issuer
   */
  owner: string;
  /**
   * order price
   */
  price: string;
  /**
   * order quantity
   */
  quantity: number;
  /**
   * 1 for buy and 2 for sell
   */
  side: number;
  /**
   * Order status
   */
  status: OrderStatus;
  /**
   * trading pair symbol
   */
  symbol: string;
  /**
   * 1 for Good Till Expire(GTE) order and 3 for Immediate Or Cancel (IOC)
   */
  timeInForce: number;
  /**
   * trade ID
   */
  tradeId: string;
  /**
   * hash of transaction
   */
  transactionHash: string;
  /**
   * time of latest order update, for example, cancel, expire
   */
  transactionTime: number;
  /**
   * only 2 is available for now, meaning limit order
   */
  type: string;
};

export type TxHash = string; // TODO(veado): Define a proper type
export type Address = string; // TODO(veado): Define a proper type

export type Asset = {
  /**
   * Asset symbol
   */
  a: string;
  /**
   * Asset value
   */
  A: string;
};

export type Assets = Asset[];

export type Trade = {
  /**
   * Receiver address
   */
  o: Address;
  /**
   * Asset to trade
   */
  c: Assets;
};

export type Trades = Trade[];

export type TransferEventData = {
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
};
/**
 * Payload of a transfer event
 * https://docs.binance.org/api-reference/dex-api/ws-streams.html#3-transfer
 */
export type TransferEvent = {
  /**
   * Name of the event
   */
  stream: string;
  /**
   * Event payload
   */
  data?: TransferEventData;
};

/**
 * Balance
 * @see https://docs.binance.org/api-reference/dex-api/paths.html#balance
 */
export type Balance = {
  /**
   * asset symbol, e.g. BNB
   */
  symbol: string;
  /**
   * In decimal form, e.g. 0.00000000
   */
  free: string;
  /**
   * In decimal form, e.g. 0.00000000
   */
  locked: string;
  /**
   * In decimal form, e.g. 0.00000000
   */
  frozen: string;
};

/**
 * Result of  `bncClient.transfer(...)`
 * to transfer tokens from one address to another.
 * See https://github.com/binance-chain/javascript-sdk/wiki/API-Documentation#bncclienttransferfromaddress-toaddress-amount-asset-memo-sequence--promise
 * */
export type TransferResult = { result?: Transfer[] };

export type Transfer = {
  code: number;
  hash: string;
  log: string;
  ok: boolean;
};
