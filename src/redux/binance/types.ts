import { binance } from 'asgardex-common';
import { Maybe } from '../../types/bepswap';

export type State = {
  tokenList:  binance.Token[];
  marketList:  binance.Market[];
  ticker: Maybe< binance.TickerStatistics>;
  account: Maybe<binance.Account>;
  accountSequence: Maybe<number>;
  transactions: Maybe< binance.TxPage>;
  openOrders: Maybe< binance.OrderList>;
  error: Maybe<Error>;
  loadingToken: boolean;
  loadingMarket: boolean;
  loadingTicker: boolean;
};
