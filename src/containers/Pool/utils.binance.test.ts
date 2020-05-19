import { mocked } from 'ts-jest/utils';
import { TransferResult, BinanceClient } from '@thorchain/asgardex-binance';
import { tokenAmount } from '@thorchain/asgardex-token';
import {
  CreatePoolErrorMsg,
  confirmWithdraw,
  confirmCreatePool,
  WithdrawErrorMsg,
  confirmStake,
  StakeErrorMsg,
} from './utils';

const transferResponseMock: TransferResult = {
  result: [{ code: 1, hash: 'hash', log: 'log', ok: true }],
};

const mockClient = jest.fn(() => Promise.resolve({
  transfer: jest.fn(() => Promise.resolve(transferResponseMock)),
  multiSend: jest.fn(() => Promise.resolve(transferResponseMock)),
  // all other functions not needed for testing and filled as simple as possible
  getBalance: jest.fn(() => Promise.reject(new Error('Not needed for testing...'))),
  isTestnet: jest.fn(() => true),
  setPrivateKey: jest.fn(() => Promise.reject(new Error('Not needed for testing...'))),
  isValidAddress: jest.fn(() => Promise.reject(new Error('Not needed for testing...'))),
  getMarkets: jest.fn(() => Promise.reject(new Error('Not needed for testing...'))),
  removePrivateKey: jest.fn(() => Promise.reject(new Error('Not needed for testing...'))),
}));

describe('pool/utils/', () => {
  describe('binance transfers', () => {
    let bncClient: BinanceClient;
    beforeAll(async () => {
      bncClient = await mockClient();
    });

    describe('confirmWithdraw', () => {
      beforeEach(async () => {
        mocked(bncClient.transfer).mockClear();
      });

      it('returns result of a transfer', async () => {
        const response = await confirmWithdraw({
          bncClient,
          wallet: 'abc123',
          poolAddress: 'abc456',
          symbol: 'BNB',
          percent: 22,
        });
        expect(bncClient.transfer).toBeCalledTimes(1);
        const result = response?.result ?? [];
        expect(response).toBeTruthy();
        expect(result[0].ok).not.toBeUndefined();
      });
      it('rejects if wallet address is not provided', async () => {
        await expect(
          confirmWithdraw({
            bncClient,
            wallet: '',
            poolAddress: 'abc456',
            symbol: 'BNB',
            percent: 22,
          }),
        ).rejects.toEqual(new Error(WithdrawErrorMsg.MISSING_WALLET));
      });
      it('rejects if pool address is not provided', async () => {
        await expect(
          confirmWithdraw({
            bncClient,
            wallet: 'abc123',
            poolAddress: '',
            symbol: 'BNB',
            percent: 22,
          }),
        ).rejects.toEqual(new Error(WithdrawErrorMsg.MISSING_POOL_ADDRESS));
      });
    });

    describe('confirmCreatePool', () => {
      beforeEach(async () => {
        mocked(bncClient.multiSend).mockClear();
      });

      it('returns result of a transfer', async () => {
        const response = await confirmCreatePool({
          bncClient,
          wallet: 'abc123',
          runeAmount: tokenAmount(2),
          tokenAmount: tokenAmount(1),
          poolAddress: 'bnb1abc',
          tokenSymbol: 'BNB',
        });
        expect(bncClient.multiSend).toBeCalledTimes(1);
        const result = response?.result ?? [];
        expect(response).toBeTruthy();
        expect(result[0].ok).not.toBeUndefined();
      });

      it('rejects if wallet address is not provided', async () => {
        await expect(
          confirmCreatePool({
            bncClient,
            wallet: '',
            runeAmount: tokenAmount(2),
            tokenAmount: tokenAmount(1),
            poolAddress: 'bnb1abc',
            tokenSymbol: 'BNB',
          }),
        ).rejects.toEqual(new Error(CreatePoolErrorMsg.MISSING_WALLET));
      });

      it('rejects if token amount is not > 0', async () => {
        await expect(
          confirmCreatePool({
            bncClient,
            wallet: 'abc123',
            runeAmount: tokenAmount(2),
            tokenAmount: tokenAmount(0),
            poolAddress: 'bnb1abc',
            tokenSymbol: 'BNB',
          }),
        ).rejects.toEqual(new Error(CreatePoolErrorMsg.INVALID_TOKEN_AMOUNT));
      });

      it('rejects if pool address is missing', async () => {
        await expect(
          confirmCreatePool({
            bncClient,
            wallet: 'abc123',
            runeAmount: tokenAmount(2),
            tokenAmount: tokenAmount(1),
            poolAddress: '',
            tokenSymbol: 'BNB',
          }),
        ).rejects.toEqual(new Error(CreatePoolErrorMsg.MISSING_POOL_ADDRESS));
      });

      it('rejects if token symbol is missing', async () => {
        await expect(
          confirmCreatePool({
            bncClient,
            wallet: 'abc123',
            runeAmount: tokenAmount(2),
            tokenAmount: tokenAmount(1),
            poolAddress: 'bnb1abc',
            tokenSymbol: '',
          }),
        ).rejects.toEqual(new Error(CreatePoolErrorMsg.MISSING_TOKEN_SYMBOL));
      });
    });

    describe('confirmStake', () => {
      beforeEach(async () => {
        mocked(bncClient.transfer).mockClear();
        mocked(bncClient.multiSend).mockClear();
      });
      it('calls `multiSend` to stake', async () => {
        const response = await confirmStake({
          bncClient,
          wallet: 'bnb1',
          runeAmount: tokenAmount(1),
          tokenAmount: tokenAmount(2),
          poolAddress: 'bnb1abc',
          symbolTo: 'BNB',
        });

        expect(bncClient.multiSend).toBeCalledTimes(1);
        const result = response?.result ?? [];
        expect(response).toBeTruthy();
        expect(result[0].ok).not.toBeUndefined();
      });

      it('rejects in case of an infinity runeAmount', async () => {
        await expect(
          confirmStake({
            bncClient,
            wallet: 'bnb1',
            runeAmount: tokenAmount(Number.POSITIVE_INFINITY),
            tokenAmount: tokenAmount(1),
            poolAddress: 'bnb1abc',
            symbolTo: 'BNB',
          }),
        ).rejects.toEqual(new Error(StakeErrorMsg.INVALID_RUNE_AMOUNT));
      });

      it('rejects in case of an infinity tokenAmount', async () => {
        await expect(
          confirmStake({
            bncClient,
            wallet: 'bnb1',
            runeAmount: tokenAmount(1),
            tokenAmount: tokenAmount(Number.POSITIVE_INFINITY),
            poolAddress: 'bnb1abc',
            symbolTo: 'BNB',
          }),
        ).rejects.toEqual(new Error(StakeErrorMsg.INVALID_TOKEN_AMOUNT));
      });

      it('rejects if pool address is missing', async () => {
        await expect(
          confirmStake({
            bncClient,
            wallet: 'bnb1',
            runeAmount: tokenAmount(1),
            tokenAmount: tokenAmount(2),
            poolAddress: '',
            symbolTo: 'BNB',
          }),
        ).rejects.toEqual(new Error(StakeErrorMsg.MISSING_POOL_ADDRESS));
      });

      it('rejects if symbol is missing', async () => {
        await expect(
          confirmStake({
            bncClient,
            wallet: 'bnb1',
            runeAmount: tokenAmount(1),
            tokenAmount: tokenAmount(2),
            poolAddress: 'bnb1abc',
            symbolTo: '',
          }),
        ).rejects.toEqual(new Error(StakeErrorMsg.MISSING_SYMBOL));
      });
    });
  });
});
