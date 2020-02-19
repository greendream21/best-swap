import { Maybe } from '../../types/bepswap';
import { Token, Market, TickerStatistics, TxPage, OrderList, Account } from '../../types/binance';

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
