import { mocked } from 'ts-jest/utils';
import { TransferEvent, TransferResult } from '../../types/binance';
import {
  CreatePoolErrorMsg,
  getTxType,
  withdrawResult,
  getCreatePoolTokens,
  getPoolData,
  getCalcResult,
  CalcResult,
  PoolData,
  getCreatePoolCalc,
  CreatePoolCalc,
  confirmWithdraw,
  confirmCreatePool,
  WithdrawErrorMsg,
  confirmStake,
  StakeErrorMsg,
} from './utils';
import { AssetData } from '../../redux/wallet/types';
import {
  PoolDetail,
  PoolDetailStatusEnum,
} from '../../types/generated/midgard';
import { PriceDataIndex, PoolDataMap } from '../../redux/midgard/types';

import bncClient from '../../clients/binance';

const responseMock: TransferResult = {
  result: [{ code: 1, hash: 'hash', log: 'log', ok: true }],
};

jest.mock('../../clients/binance', () => {
  return {
    transfer: jest.fn(() => Promise.resolve(responseMock)),
    multiSend: jest.fn(() => Promise.resolve(responseMock)),
  };
});

const poolData: PoolDataMap = {
  BNB: {
    asset: 'BNB.BNB',
    assetDepth: 119316,
    assetROI: -0.40342,
    assetStakedTotal: 200000,
    buyAssetCount: 1,
    buyFeeAverage: 17392308,
    buyFeesTotal: 17392308,
    buySlipAverage: 0.11079999804496765,
    buyTxAverage: 328165298,
    buyVolume: 328165298,
    poolDepth: 13777400000,
    poolFeeAverage: 8696154,
    poolFeesTotal: 17392308,
    poolROI: -0.1742444563552833,
    poolROI12: -0.1742444563552833,
    poolSlipAverage: 0.055399999022483826,
    poolStakedTotal: 18076984478,
    poolTxAverage: 164082649,
    poolUnits: 2705690593,
    poolVolume: 328165298,
    poolVolume24hr: 0,
    price: 57734.922390961816,
    runeDepth: 6888700000,
    runeROI: 0.054931087289433383,
    runeStakedTotal: 6530000000,
    sellAssetCount: 0,
    sellFeeAverage: 0,
    sellFeesTotal: 0,
    sellSlipAverage: 0,
    sellTxAverage: 0,
    sellVolume: 0,
    stakeTxCount: 2,
    stakersCount: 1,
    stakingTxCount: 2,
    status: 'enabled',
    swappersCount: 1,
    swappingTxCount: 1,
    withdrawTxCount: 0,
  } as PoolDetail,
  'TCAN-014': {
    asset: 'BNB.TCAN-014',
    assetDepth: 5654700000,
    assetROI: 0,
    assetStakedTotal: 5654700000,
    buyAssetCount: 0,
    buyFeeAverage: 0,
    buyFeesTotal: 0,
    buySlipAverage: 0,
    buyTxAverage: 0,
    buyVolume: 0,
    poolDepth: 216408800000,
    poolFeeAverage: 0,
    poolFeesTotal: 0,
    poolROI: 0,
    poolROI12: 0,
    poolSlipAverage: 0,
    poolStakedTotal: 216408800000,
    poolTxAverage: 0,
    poolUnits: 56929542778,
    poolVolume: 0,
    poolVolume24hr: 0,
    price: 19.13530337595275,
    runeDepth: 108204400000,
    runeROI: 0,
    runeStakedTotal: 108204400000,
    sellAssetCount: 0,
    sellFeeAverage: 0,
    sellFeesTotal: 0,
    sellSlipAverage: 0,
    sellTxAverage: 0,
    sellVolume: 0,
    stakeTxCount: 2,
    stakersCount: 1,
    stakingTxCount: 2,
    status: 'enabled',
    swappersCount: 0,
    swappingTxCount: 0,
    withdrawTxCount: 0,
  } as PoolDetail,
};

describe('pool/utils/', () => {
  describe('witdrawResult', () => {
    it('should validate a withdraw transfer', () => {
      const tx: TransferEvent = {
        stream: 'transfers',
        data: {
          e: 'outboundTransferInfo',
          E: 62498151,
          H: '1A4C9EB6438CC87B9DD67707770DE662F6212B68A93A5ABCE2DA0AC09B3FDCE1',
          M:
            'OUTBOUND:0C48D82F045B5AABD02663551D19CE18D2266E966ABD3A4D5ACBD3762C8EC692',
          f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          t: [
            {
              o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
              c: [
                {
                  a: 'TUSDB-000',
                  A: '0.79146284',
                },
              ],
            },
          ],
        },
      };
      const result = withdrawResult({
        tx,
        hash:
          '0C48D82F045B5AABD02663551D19CE18D2266E966ABD3A4D5ACBD3762C8EC692',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('getTxType', () => {
    it('should be stake ', () => {
      const memo = 'STAKE:TUSDB-000';
      const result = getTxType(memo);
      expect(result).toEqual('stake');
    });

    it('should be withdraw ', () => {
      const memo = 'WITHDRAW:BNB-000';
      const result = getTxType(memo);
      expect(result).toEqual('withdraw');
    });

    it('should be unknown', () => {
      const memo = 'XXX:YYY:ZZZ';
      const result = getTxType(memo);
      expect(result).toEqual('unknown');
    });

    it('should be unknown by a missing memo', () => {
      const result = getTxType(undefined);
      expect(result).toEqual('unknown');
    });
  });

  describe('getCreatePoolTokens', () => {
    it('should filter pool assets ', () => {
      const assetA: AssetData = {
        asset: 'A',
        assetValue: 1,
        price: 2,
      };
      const assetB: AssetData = {
        asset: 'B',
        assetValue: 1,
        price: 2,
      };
      const assets: AssetData[] = [assetA, assetB];
      const pools: string[] = ['A.A'];
      const result = getCreatePoolTokens(assets, pools);
      const expected = [assetB];
      expect(result).toEqual(expected);
    });
    it('should filter `RUNE` assets ', () => {
      const assetA: AssetData = {
        asset: 'RUNE',
        assetValue: 1,
        price: 2,
      };
      const assetB: AssetData = {
        asset: 'RUNE',
        assetValue: 1,
        price: 2,
      };
      const assetC: AssetData = {
        asset: 'C',
        assetValue: 1,
        price: 2,
      };
      const assets: AssetData[] = [assetA, assetB, assetC];
      const pools: string[] = ['A.A'];
      const result = getCreatePoolTokens(assets, pools);
      const expected = [assetC];
      expect(result).toEqual(expected);
    });
  });
  describe('getPoolData', () => {
    const bnbPoolDetail: PoolDetail = {
      asset: 'BNB.BNB',
      assetDepth: 611339,
      assetROI: -0.4442372727272727,
      assetStakedTotal: 1100000,
      buyAssetCount: 1,
      buyFeeAverage: 199600,
      buyFeesTotal: 199600,
      buySlipAverage: 1002000,
      buyTxAverage: 32387,
      buyVolume: 32387,
      poolDepth: 399999598,
      poolFeeAverage: 99800,
      poolFeesTotal: 199600,
      poolROI: 999.2768763636363,
      poolROI12: 1000.2778813636363,
      poolSlipAverage: 501000,
      poolStakedTotal: 359965441,
      poolTxAverage: 16193,
      poolUnits: 47400323,
      poolVolume: 32387,
      poolVolume24hr: 0,
      price: 327.15040100500704,
      runeDepth: 199999799,
      runeROI: 1998.99799,
      runeStakedTotal: 100000,
      sellAssetCount: 0,
      sellFeeAverage: 0,
      sellFeesTotal: 0,
      sellSlipAverage: 0,
      sellTxAverage: 0,
      sellVolume: 0,
      stakeTxCount: 3,
      stakersCount: 1,
      stakingTxCount: 4,
      status: PoolDetailStatusEnum.Enabled,
      swappersCount: 1,
      swappingTxCount: 1,
      withdrawTxCount: 1,
    };

    const fsnPoolDetail: PoolDetail = {
      asset: 'BNB.FSN-F1B',
      assetDepth: 100000,
      assetROI: 0,
      assetStakedTotal: 100000,
      buyAssetCount: 0,
      buyFeeAverage: 0,
      buyFeesTotal: 0,
      buySlipAverage: 0,
      buyTxAverage: 0,
      buyVolume: 0,
      poolDepth: 400000,
      poolFeeAverage: 0,
      poolFeesTotal: 0,
      poolROI: 0.5,
      poolROI12: 0.5,
      poolSlipAverage: 0,
      poolStakedTotal: 300000,
      poolTxAverage: 0,
      poolUnits: 87500,
      poolVolume: 0,
      poolVolume24hr: 0,
      price: 2,
      runeDepth: 200000,
      runeROI: 1,
      runeStakedTotal: 100000,
      sellAssetCount: 0,
      sellFeeAverage: 0,
      sellFeesTotal: 0,
      sellSlipAverage: 0,
      sellTxAverage: 0,
      sellVolume: 0,
      stakeTxCount: 2,
      stakersCount: 1,
      stakingTxCount: 2,
      status: PoolDetailStatusEnum.Enabled,
      swappersCount: 0,
      swappingTxCount: 0,
      withdrawTxCount: 0,
    };
    const priceIndex: PriceDataIndex = {
      RUNE: 1,
      FSN: 2,
    };
    it('returns PoolData for a FSN based pool', () => {
      const expected: PoolData = {
        asset: 'RUNE',
        target: 'FSN',
        depth: 200000,
        volume24: 0,
        volumeAT: 0,
        transaction: 0,
        liqFee: 0,
        roiAT: 0.5,
        totalSwaps: 0,
        totalStakers: 1,
        values: {
          pool: {
            asset: 'RUNE',
            target: 'FSN',
          },
          target: 'FSN',
          symbol: 'FSN-F1B',
          depth: 'RUNE 0',
          volume24: 'RUNE 0',
          transaction: 'RUNE 0',
          liqFee: '0%',
          roiAT: '0% pa',
        },
        raw: {
          depth: 0,
          volume24: 0,
          transaction: 0,
          liqFee: 0,
          roiAT: 0,
        },
      };
      const result = getPoolData('RUNE', fsnPoolDetail, priceIndex, 'RUNE');
      expect(result).toEqual(expected);
    });
    it('returns PoolData for a BNB based pool', () => {
      const expected: PoolData = {
        asset: 'RUNE',
        target: 'BNB',
        depth: 199999799,
        volume24: 0,
        volumeAT: 32387,
        transaction: 16193,
        liqFee: 99800,
        roiAT: 999.2768763636363,
        totalSwaps: 1,
        totalStakers: 1,
        values: {
          pool: {
            asset: 'RUNE',
            target: 'BNB',
          },
          target: 'BNB',
          symbol: 'BNB',
          depth: 'RUNE 2',
          volume24: 'RUNE 0',
          transaction: 'RUNE 0',
          liqFee: '0%',
          roiAT: '0% pa',
        },
        raw: {
          depth: 2,
          volume24: 0,
          transaction: 0,
          liqFee: 0,
          roiAT: 0,
        },
      };
      const result = getPoolData('RUNE', bnbPoolDetail, priceIndex, 'RUNE');
      expect(result).toEqual(expected);
    });
  });

  describe('getCalcResult', () => {
    it('calculates result of staking into RUNE - BNB pool ', () => {
      const poolAddress = 'tbnabc123';
      const runeAmount = 744.568;
      const runePrice = 1;
      const tokenAmount = 0.023;
      const expected: CalcResult = {
        poolAddress: 'tbnabc123',
        ratio: 0.000030627871362940275,
        symbolTo: 'BNB',
        poolUnits: 2705690593,
        poolPrice: 32650,
        newPrice: 32394.72,
        newDepth: 81305900000,
        share: 91.97,
        Pr: 1,
        R: 6530000000,
        T: 200000,
      };

      const result: CalcResult = getCalcResult(
        'BNB',
        poolData,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount,
      );

      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.ratio).toEqual(expected.ratio);
      expect(result.symbolTo).toEqual(expected.symbolTo);
      expect(result.poolUnits).toEqual(expected.poolUnits);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.newPrice).toEqual(expected.newPrice);
      expect(result.newDepth).toEqual(expected.newDepth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      expect(result.R).toEqual(expected.R);
      expect(result.T).toEqual(expected.T);
      // Test all again just in case we will forget to test a new property in the future
      expect(result).toEqual(expected);
    });

    it('calculates result of staking into RUNE - TCAN pool ', () => {
      const poolAddress = 'tbnabc123';
      const runeAmount = 938.803;
      const runePrice = 1;
      const tokenAmount = 49.061;
      const expected = {
        poolAddress: 'tbnabc123',
        ratio: 0.052259427527900894,
        symbolTo: 'TCAN-014',
        poolUnits: 56929542778,
        poolPrice: 19.14,
        newPrice: 19.14,
        newDepth: 202084405946.38,
        share: 46.46,
        Pr: 1,
        R: 108204400000,
        T: 5654700000,
      };

      const result: CalcResult = getCalcResult(
        'TCAN-014',
        poolData,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount,
      );

      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.ratio).toEqual(expected.ratio);
      expect(result.symbolTo).toEqual(expected.symbolTo);
      expect(result.poolUnits).toEqual(expected.poolUnits);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.newPrice).toEqual(expected.newPrice);
      expect(result.newDepth).toEqual(expected.newDepth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      expect(result.R).toEqual(expected.R);
      expect(result.T).toEqual(expected.T);
      // Test all again just in case we will forget to test a new property in the future
      expect(result).toEqual(expected);
    });
  });

  describe('getCreatePoolCalc', () => {
    it('calculates data to create a TOMOB-1E1 pool', () => {
      const tokenSymbol = 'TOMOB-1E1';
      const poolAddress = 'tbnb1XXX';
      const runeAmount = 809.288;
      const runePrice = 1;
      const tokenAmount = 0.14;
      const expected: CreatePoolCalc = {
        poolAddress: 'tbnb1XXX',
        tokenSymbol: 'TOMOB-1E1',
        poolPrice: 5780.63,
        depth: 809.29,
        share: 100,
        Pr: 1,
      };
      const result = getCreatePoolCalc({
        tokenSymbol,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount,
      });
      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.tokenSymbol).toEqual(expected.tokenSymbol);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.depth).toEqual(expected.depth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      // Test all again, just in case of other properties in the future
      expect(result).toEqual(expected);
    });

    it('calculates data to create a TOMOB-1E1 pool again, but with more amounts', () => {
      const tokenSymbol = 'TOMOB-1E1';
      const poolAddress = 'tbnb1XXX';
      const runeAmount = 3237.152;
      const runePrice = 1;
      const tokenAmount = 0.559;
      const expected: CreatePoolCalc = {
        poolAddress: 'tbnb1XXX',
        tokenSymbol: 'TOMOB-1E1',
        poolPrice: 5790.97,
        depth: 3237.15,
        share: 100,
        Pr: 1,
      };
      const result = getCreatePoolCalc({
        tokenSymbol,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount,
      });
      expect(result.poolAddress).toEqual(expected.poolAddress);
      expect(result.tokenSymbol).toEqual(expected.tokenSymbol);
      expect(result.poolPrice).toEqual(expected.poolPrice);
      expect(result.depth).toEqual(expected.depth);
      expect(result.share).toEqual(expected.share);
      expect(result.Pr).toEqual(expected.Pr);
      // Test all again, just in case of other properties in the future
      expect(result).toEqual(expected);
    });
  });

  describe('confirmWithdraw', () => {
    beforeEach(() => {
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
    beforeEach(() => {
      mocked(bncClient.multiSend).mockClear();
    });

    it('returns result of a transfer', async () => {
      const response = await confirmCreatePool({
        bncClient,
        wallet: 'abc123',
        runeAmount: 2,
        tokenAmount: 1,
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
          runeAmount: 2,
          tokenAmount: 1,
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
          runeAmount: 2,
          tokenAmount: 0,
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
          runeAmount: 2,
          tokenAmount: 1,
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
          runeAmount: 2,
          tokenAmount: 1,
          poolAddress: 'bnb1abc',
          tokenSymbol: '',
        }),
      ).rejects.toEqual(new Error(CreatePoolErrorMsg.MISSING_TOKEN_SYMBOL));
    });
  });

  describe('confirmStake', () => {
    beforeEach(() => {
      mocked(bncClient.transfer).mockClear();
      mocked(bncClient.multiSend).mockClear();
    });
    it('calls `multiSend` to stake', async () => {
      const response = await confirmStake({
        bncClient,
        wallet: 'bnb1',
        runeAmount: 1,
        tokenAmount: 2,
        poolAddress: 'bnb1abc',
        symbolTo: 'BNB',
      });

      expect(bncClient.multiSend).toBeCalledTimes(1);
      const result = response?.result ?? [];
      expect(response).toBeTruthy();
      expect(result[0].ok).not.toBeUndefined();
    });

    it('calls `transfer` to stake if runeAmount <= 0', async () => {
      const response = await confirmStake({
        bncClient,
        wallet: 'bnb1',
        runeAmount: 0,
        tokenAmount: 1,
        poolAddress: 'bnb1abc',
        symbolTo: 'BNB',
      });

      expect(bncClient.transfer).toBeCalledTimes(1);
      const result = response?.result ?? [];
      expect(response).toBeTruthy();
      expect(result[0].ok).not.toBeUndefined();
    });

    it('calls `transfer` to stake if tokenAmount <= 0', async () => {
      const response = await confirmStake({
        bncClient,
        wallet: 'bnb1',
        runeAmount: 1,
        tokenAmount: 0,
        poolAddress: 'bnb1abc',
        symbolTo: 'BNB',
      });

      expect(bncClient.transfer).toBeCalledTimes(1);
      const result = response?.result ?? [];
      expect(response).toBeTruthy();
      expect(result[0].ok).not.toBeUndefined();
    });

    it('rejects if pool address is missing', async () => {
      await expect(
        confirmStake({
          bncClient,
          wallet: 'bnb1',
          runeAmount: 1,
          tokenAmount: 2,
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
          runeAmount: 1,
          tokenAmount: 2,
          poolAddress: 'bnb1abc',
          symbolTo: '',
        }),
      ).rejects.toEqual(new Error(StakeErrorMsg.MISSING_SYMBOL));
    });
  });
});
