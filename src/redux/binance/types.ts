import { Token, TickerStatistics, Account, TxPage, OrderList, Market } from '@thorchain/asgardex-binance';
import { Maybe } from '../../types/bepswap';

export type State = {
  tokenList: Token[];
  marketList: Market[];
  ticker: Maybe<TickerStatistics>;
  account: Maybe<Account>;
  accountSequence: Maybe<number>;
  transactions: Maybe<TxPage>;
  openOrders: Maybe<OrderList>;
  error: Maybe<Error>;
  loadingToken: boolean;
  loadingMarket: boolean;
  loadingTicker: boolean;
};
