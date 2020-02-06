import { State } from './types';
import {
  BinanceActionTypes,
  GET_BINANCE_TOKENS,
  GET_BINANCE_TOKENS_SUCCESS,
  GET_BINANCE_TOKENS_FAILED,
  GET_BINANCE_ACCOUNT_SUCCESS,
  GET_BINANCE_TRANSACTIONS_SUCCESS,
  GET_BINANCE_OPEN_ORDERS_SUCCESS,
  GET_BINANCE_MARKETS,
  GET_BINANCE_MARKETS_SUCCESS,
  GET_BINANCE_MARKETS_FAILED,
  GET_BINANCE_TICKER,
  GET_BINANCE_TICKER_SUCCESS,
  GET_BINANCE_TICKER_FAILED,
} from './actions';
import { Nothing } from '../../types/bepswap';

const initState: State = {
  tokenList: [],
  marketList: [],
  ticker: Nothing,
  account: Nothing,
  accountSequence: Nothing,
  transactions: Nothing,
  openOrders: Nothing,
  error: Nothing,
  loadingToken: false,
  loadingMarket: false,
  loadingTicker: false,
};

export default function apiReducer(
  state: State = initState,
  action: BinanceActionTypes,
) {
  switch (action.type) {
    case GET_BINANCE_TOKENS:
      return {
        ...state,
        loadingToken: true,
        error: null,
      };
    case GET_BINANCE_TOKENS_SUCCESS:
      return {
        ...state,
        loadingToken: false,
        tokenList: action.payload,
      };
    case GET_BINANCE_TOKENS_FAILED:
      return {
        ...state,
        loadingToken: false,
        error: action.payload,
      };
    case GET_BINANCE_MARKETS:
      return {
        ...state,
        loadingMarket: true,
        error: null,
      };
    case GET_BINANCE_MARKETS_SUCCESS:
      return {
        ...state,
        loadingMarket: false,
        marketList: action.payload,
      };
    case GET_BINANCE_MARKETS_FAILED:
      return {
        ...state,
        loadingMarket: false,
        error: action.payload,
      };
    case GET_BINANCE_TICKER:
      return {
        ...state,
        loadingTicker: true,
        error: null,
      };
    case GET_BINANCE_TICKER_SUCCESS:
      return {
        ...state,
        ticker: action.payload[0] || Nothing,
        loadingTicker: false,
      };
    case GET_BINANCE_TICKER_FAILED:
      return {
        ...state,
        loadingTicker: false,
        error: action.payload,
      };
    case GET_BINANCE_ACCOUNT_SUCCESS:
      return {
        ...state,
        account: action.payload,
        accountSequence: action.payload.sequence || Nothing,
        error: null,
      };
    case GET_BINANCE_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
        error: null,
      };
    case GET_BINANCE_OPEN_ORDERS_SUCCESS:
      return {
        ...state,
        openOrders: action.payload,
        error: Nothing,
      };
    default:
      return state;
  }
}
