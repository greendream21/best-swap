import { BinanceClient } from '../binance';
import {
  Balance,
  Address,
  TransferResult,
  MultiTransfer,
} from '../../types/binance';

/**
 * "Manual" mock instance of `BinanceClient`
 * to provide "static" results for some async functions
 *
 * Based on "Manual mock that is another ES6 class"
 * https://jestjs.io/docs/en/es6-class-mocks#manual-mock-that-is-another-es6-class
 */
class BinanceMock implements BinanceClient {
  getBalance = async (_: Address): Promise<Balance> =>
    Promise.resolve({
      symbol: 'ANY-SYMBOL',
      free: 'free-value',
      locked: 'locked-value',
      frozen: 'frozen-value',
    });

  multiSend = async (
    _address: Address,
    _transactions: MultiTransfer[],
    _memo?: string,
  ): Promise<TransferResult> =>
    Promise.resolve({
      result: [{ code: 1, hash: 'hash', log: 'log', ok: true }],
    });

  transfer = async (
    _fromAddress: Address,
    _toAddress: Address,
    _amount: number,
    _asset: string,
    _memo?: string,
  ): Promise<TransferResult> =>
    Promise.resolve({
      result: [{ code: 1, hash: 'hash', log: 'log', ok: true }],
    });
}

export default new BinanceMock();
