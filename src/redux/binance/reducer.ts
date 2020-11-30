import { initial, pending, success, failure } from '@devexperts/remote-data-ts';
import { Reducer } from 'redux';

import { Nothing } from 'types/bepswap';

import { BinanceActionTypes } from './actions';
import { State } from './types';

const initState: State = {
  tokenList: [],
  marketList: [],
  ticker: Nothing,
  account: Nothing,
  accountSequence: Nothing,
  transactions: Nothing,
  openOrders: Nothing,
  transferFees: initial,
  error: Nothing,
  loadingToken: false,
  loadingMarket: false,
  loadingTicker: false,
  wsError: Nothing,
  wsTransferEvent: initial,
};

const reducer: Reducer<State, BinanceActionTypes> = (
  state = initState,
  action,
) => {
  switch (action.type) {
    case 'GET_BINANCE_TOKENS':
      return {
        ...state,
        loadingToken: true,
        error: null,
      };
    case 'GET_BINANCE_TOKENS_SUCCESS':
      return {
        ...state,
        loadingToken: false,
        tokenList: action.payload,
      };
    case 'GET_BINANCE_TOKENS_FAILED':
      return {
        ...state,
        loadingToken: false,
        error: action.payload,
      };
    case 'GET_BINANCE_MARKETS':
      return {
        ...state,
        loadingMarket: true,
        error: null,
      };
    case 'GET_BINANCE_MARKETS_SUCCESS':
      return {
        ...state,
        loadingMarket: false,
        marketList: action.payload,
      };
    case 'GET_BINANCE_MARKETS_FAILED':
      return {
        ...state,
        loadingMarket: false,
        error: action.payload,
      };
    case 'GET_BINANCE_TICKER':
      return {
        ...state,
        loadingTicker: true,
        error: null,
      };
    case 'GET_BINANCE_TICKER_SUCCESS':
      return {
        ...state,
        ticker: action.payload[0] || Nothing,
        loadingTicker: false,
      };
    case 'GET_BINANCE_TICKER_FAILED':
      return {
        ...state,
        loadingTicker: false,
        error: action.payload,
      };
    case 'GET_BINANCE_ACCOUNT_SUCCESS':
      return {
        ...state,
        account: action.payload,
        accountSequence: action.payload.sequence || Nothing,
        error: null,
      };
    case 'GET_BINANCE_TRANSACTIONS_SUCCESS':
      return {
        ...state,
        transactions: action.payload,
        error: null,
      };
    case 'GET_BINANCE_OPEN_ORDERS_SUCCESS':
      return {
        ...state,
        openOrders: action.payload,
        error: Nothing,
      };
    case 'GET_BINANCE_FEES':
      return {
        ...state,
        transferFees: pending,
        error: Nothing,
      };
    case 'GET_BINANCE_TRANSFER_FEES_RESULT':
      return {
        ...state,
        transferFees: action.result,
        error: Nothing,
      };
    case 'WS_BINANCE_ERROR':
      return {
        ...state,
        wsError: action.payload,
      };
    case 'SUBSCRIBE_BINANCE_TRANSFERS':
      return {
        ...state,
        wsTransferEvent: pending,
      };
    case 'SUBSCRIBE_BINANCE_TRANSFERS_FAILED':
      return {
        ...state,
        wsTransferEvent: failure(action.error),
      };
    case 'UNSUBSCRIBE_BINANCE_TRANSFERS':
      return {
        ...state,
        wsTransferEvent: initial,
      };
    case 'BINANCE_TRANSFERS_MESSAGE_RECEIVED':
      return {
        ...state,
        wsTransferEvent: success(action.event),
      };
    default:
      return state;
  }
};

export default reducer;
