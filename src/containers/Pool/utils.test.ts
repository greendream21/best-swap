import { binance, util } from 'asgardex-common';
import {
  getTxType,
  withdrawResult,
  getCreatePoolTokens,
  getPoolData,
  getCalcResult,
  CalcResult,
  getCreatePoolCalc,
  CreatePoolCalc,
} from './utils';
import { PoolData } from './types';
import { AssetData } from '../../redux/wallet/types';
import {
  PoolDetail,
  PoolDetailStatusEnum,
} from '../../types/generated/midgard';
import { PriceDataIndex, PoolDataMap } from '../../redux/midgard/types';
import { tokenAmount, baseAmount } from '../../helpers/tokenHelper';

const poolData: PoolDataMap = {
  BNB: {
    asset: 'BNB.BNB',
    assetDepth: '119316',
    assetROI: '-0.40342',
    assetStakedTotal: '200000',
    buyAssetCount: '1',
    buyFeeAverage: '17392308',
    buyFeesTotal: '17392308',
    buySlipAverage: '0.11079999804496765',
    buyTxAverage: '328165298',
    buyVolume: '328165298',
    poolDepth: '13777400000',
    poolFeeAverage: '8696154',
    poolFeesTotal: '17392308',
    poolROI: '-0.1742444563552833',
    poolROI12: '-0.1742444563552833',
    poolSlipAverage: '0.055399999022483826',
    poolStakedTotal: '18076984478',
    poolTxAverage: '164082649',
    poolUnits: '2705690593',
    poolVolume: '328165298',
    poolVolume24hr: '0',
    price: '57734.922390961816',
    runeDepth: '6888700000',
    runeROI: '0.054931087289433383',
    runeStakedTotal: '6530000000',
    sellAssetCount: '0',
    sellFeeAverage: '0',
    sellFeesTotal: '0',
    sellSlipAverage: '0',
    sellTxAverage: '0',
    sellVolume: '0',
    stakeTxCount: '2',
    stakersCount: '1',
    stakingTxCount: '2',
    status: 'enabled',
    swappersCount: '1',
    swappingTxCount: '1',
    withdrawTxCount: '0',
  } as PoolDetail,
  'TCAN-014': {
    asset: 'BNB.TCAN-014',
    assetDepth: '5654700000',
    assetROI: '0',
    assetStakedTotal: '5654700000',
    buyAssetCount: '0',
    buyFeeAverage: '0',
    buyFeesTotal: '0',
    buySlipAverage: '0',
    buyTxAverage: '0',
    buyVolume: '0',
    poolDepth: '216408800000',
    poolFeeAverage: '0',
    poolFeesTotal: '0',
    poolROI: '0',
    poolROI12: '0',
    poolSlipAverage: '0',
    poolStakedTotal: '216408800000',
    poolTxAverage: '0',
    poolUnits: '56929542778',
    poolVolume: '0',
    poolVolume24hr: '0',
    price: '19.13530337595275',
    runeDepth: '108204400000',
    runeROI: '0',
    runeStakedTotal: '108204400000',
    sellAssetCount: '0',
    sellFeeAverage: '0',
    sellFeesTotal: '0',
    sellSlipAverage: '0',
    sellTxAverage: '0',
    sellVolume: '0',
    stakeTxCount: '2',
    stakersCount: '1',
    stakingTxCount: '2',
    status: 'enabled',
    swappersCount: '0',
    swappingTxCount: '0',
    withdrawTxCount: '0',
  } as PoolDetail,
};

describe('pool/utils/', () => {
  describe('witdrawResult', () => {
    it('should validate a withdraw transfer', () => {
      const tx: binance.TransferEvent = {
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
        assetValue: tokenAmount(1),
        price: util.bn(2),
      };
      const assetB: AssetData = {
        asset: 'B',
        assetValue: tokenAmount(1),
        price: util.bn(2),
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
        assetValue: tokenAmount(1),
        price: util.bn(2),
      };
      const assetB: AssetData = {
        asset: 'RUNE',
        assetValue: tokenAmount(1),
        price: util.bn(2),
      };
      const assetC: AssetData = {
        asset: 'C',
        assetValue: tokenAmount(1),
        price: util.bn(2),
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
      assetDepth: '611339',
      assetROI: '-0.4442372727272727',
      assetStakedTotal: '1100000',
      buyAssetCount: '1',
      buyFeeAverage: '199600',
      buyFeesTotal: '199600',
      buySlipAverage: '1002000',
      buyTxAverage: '32387',
      buyVolume: '32387',
      poolDepth: '399999598',
      poolFeeAverage: '99800',
      poolFeesTotal: '199600',
      poolROI: '999.2768763636363',
      poolROI12: '1000.2778813636363',
      poolSlipAverage: '501000',
      poolStakedTotal: '359965441',
      poolTxAverage: '16193',
      poolUnits: '47400323',
      poolVolume: '32387',
      poolVolume24hr: '0',
      price: '327.15040100500704',
      runeDepth: '199999799',
      runeROI: '1998.99799',
      runeStakedTotal: '100000',
      sellAssetCount: '0',
      sellFeeAverage: '0',
      sellFeesTotal: '0',
      sellSlipAverage: '0',
      sellTxAverage: '0',
      sellVolume: '0',
      stakeTxCount: '3',
      stakersCount: '1',
      stakingTxCount: '4',
      status: PoolDetailStatusEnum.Enabled,
      swappersCount: '1',
      swappingTxCount: '1',
      withdrawTxCount: '1',
    };

    const fsnPoolDetail: PoolDetail = {
      asset: 'BNB.FSN-F1B',
      assetDepth: '100000',
      assetROI: '0',
      assetStakedTotal: '100000',
      buyAssetCount: '0',
      buyFeeAverage: '0',
      buyFeesTotal: '0',
      buySlipAverage: '0',
      buyTxAverage: '0',
      buyVolume: '0',
      poolDepth: '400000',
      poolFeeAverage: '0',
      poolFeesTotal: '0',
      poolROI: '0.5',
      poolROI12: '0.5',
      poolSlipAverage: '0',
      poolStakedTotal: '300000',
      poolTxAverage: '0',
      poolUnits: '87500',
      poolVolume: '0',
      poolVolume24hr: '0',
      price: '2',
      runeDepth: '200000',
      runeROI: '1',
      runeStakedTotal: '100000',
      sellAssetCount: '0',
      sellFeeAverage: '0',
      sellFeesTotal: '0',
      sellSlipAverage: '0',
      sellTxAverage: '0',
      sellVolume: '0',
      stakeTxCount: '2',
      stakersCount: '1',
      stakingTxCount: '2',
      status: PoolDetailStatusEnum.Enabled,
      swappersCount: '0',
      swappingTxCount: '0',
      withdrawTxCount: '0',
    };
    const priceIndex: PriceDataIndex = {
      RUNE: util.bn(1),
      FSN: util.bn(2),
    };
    it('returns PoolData for a FSN based pool', () => {
      const expected: PoolData = {
        asset: 'RUNE',
        target: 'FSN',
        depth: baseAmount(200000),
        volume24: baseAmount(0),
        volumeAT: baseAmount(0),
        transaction: baseAmount(0),
        liqFee: baseAmount(0),
        roiAT: baseAmount(0.5),
        totalSwaps: 0,
        totalStakers: 1,
        values: {
          pool: {
            asset: 'RUNE',
            target: 'FSN',
          },
          target: 'FSN',
          symbol: 'FSN-F1B',
          depth: 'RUNE 0.00',
          volume24: 'RUNE 0.00',
          transaction: 'RUNE 0.00',
          liqFee: '0.00%',
          roiAT: '0.00% pa',
          poolPrice: 'RUNE 2.00',
        },
        raw: {
          depth: baseAmount(200000),
          volume24: baseAmount(0),
          transaction: baseAmount(0),
          liqFee: baseAmount(0),
          roiAT: baseAmount(0.5),
          poolPrice: util.bn(1),
        },
      };
      const result = getPoolData('RUNE', fsnPoolDetail, priceIndex, 'RUNE');
      const rRaw = result.raw;
      const eRaw = expected.raw;

      expect(result.asset).toEqual(expected.asset);
      expect(result.target).toEqual(expected.target);
      expect(result.depth.amount()).toEqual(expected.depth.amount());
      expect(result.volume24.amount()).toEqual(expected.volume24.amount());
      expect(result.transaction.amount()).toEqual(
        expected.transaction.amount(),
      );
      expect(result.liqFee.amount()).toEqual(expected.liqFee.amount());
      expect(result.roiAT.amount()).toEqual(expected.roiAT.amount());
      expect(result.totalSwaps).toEqual(expected.totalSwaps);
      expect(result.totalStakers).toEqual(expected.totalStakers);
      expect(result.values).toEqual(expected.values);

      expect(rRaw.depth.amount()).toEqual(eRaw.depth.amount());
      expect(rRaw.volume24.amount()).toEqual(eRaw.volume24.amount());
      expect(rRaw.transaction.amount()).toEqual(eRaw.transaction.amount());
      expect(rRaw.liqFee.amount()).toEqual(eRaw.liqFee.amount());
      expect(rRaw.roiAT.amount()).toEqual(eRaw.roiAT.amount());
      // Unsafe, just to test all props again (in case we might forget to test a new property in the future)
      expect(result.toString()).toEqual(expected.toString());
    });
    it('returns PoolData for a BNB based pool', () => {
      const expected: PoolData = {
        asset: 'RUNE',
        target: 'BNB',
        depth: baseAmount(199999799),
        volume24: baseAmount(0),
        volumeAT: baseAmount(32387),
        transaction: baseAmount(16193),
        liqFee: baseAmount(99800),
        roiAT: baseAmount(999.2768763636363),
        totalSwaps: 1,
        totalStakers: 1,
        values: {
          pool: {
            asset: 'RUNE',
            target: 'BNB',
          },
          target: 'BNB',
          symbol: 'BNB',
          depth: 'RUNE 2.00',
          volume24: 'RUNE 0.00',
          transaction: 'RUNE 0.00',
          liqFee: '0.00%',
          roiAT: '0.00% pa',
          poolPrice: 'RUNE 0.00',
        },
        raw: {
          depth: baseAmount(199999799),
          volume24: baseAmount(0),
          transaction: baseAmount(16193),
          liqFee: baseAmount(99800),
          roiAT: baseAmount(999.2768763636363),
          poolPrice: util.bn(0.09),
        },
      };
      const result = getPoolData('RUNE', bnbPoolDetail, priceIndex, 'RUNE');
      const rRaw = result.raw;
      const eRaw = expected.raw;

      expect(result.asset).toEqual(expected.asset);
      expect(result.target).toEqual(expected.target);
      expect(result.depth.amount()).toEqual(expected.depth.amount());
      expect(result.volume24.amount()).toEqual(expected.volume24.amount());
      expect(result.transaction.amount()).toEqual(
        expected.transaction.amount(),
      );
      expect(result.liqFee.amount()).toEqual(expected.liqFee.amount());
      expect(result.roiAT.amount()).toEqual(expected.roiAT.amount());
      expect(result.totalSwaps).toEqual(expected.totalSwaps);
      expect(result.totalStakers).toEqual(expected.totalStakers);
      expect(result.values).toEqual(expected.values);

      expect(rRaw.depth.amount()).toEqual(eRaw.depth.amount());
      expect(rRaw.volume24.amount()).toEqual(eRaw.volume24.amount());
      expect(rRaw.transaction.amount()).toEqual(eRaw.transaction.amount());
      expect(rRaw.liqFee.amount()).toEqual(eRaw.liqFee.amount());
      expect(rRaw.roiAT.amount()).toEqual(eRaw.roiAT.amount());
      // Unsafe, just to test all props again (in case we might forget to test a new property in the future)
      expect(result.toString()).toEqual(expected.toString());
    });
  });

  describe('getCalcResult', () => {
    it('calculates result of staking into RUNE - BNB pool ', () => {
      const poolAddress = 'tbnabc123';
      const runeAmount = tokenAmount(744.568);
      const runePrice = util.bn(1);
      const tAmount = tokenAmount(0.023);
      const expected: CalcResult = {
        poolAddress: 'tbnabc123',
        ratio: util.bn(0),
        symbolTo: 'BNB',
        poolUnits: util.bn('2705690593'),
        poolPrice: util.bn(32650),
        newPrice: util.bn(32394.72),
        newDepth: util.bn('81305900000'),
        share: util.bn(91.97),
        Pr: util.bn(1),
        R: util.bn('6530000000'),
        T: util.bn(200000),
      };

      const result: CalcResult = getCalcResult(
        'BNB',
        poolData,
        poolAddress,
        runeAmount,
        runePrice,
        tAmount,
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
      const runeAmount = tokenAmount(938.803);
      const runePrice = util.bn(1);
      const tAmount = tokenAmount(49.061);
      const expected = {
        poolAddress: 'tbnabc123',
        ratio: util.bn('0.05'),
        symbolTo: 'TCAN-014',
        poolUnits: util.bn('56929542778'),
        poolPrice: util.bn(19.14),
        newPrice: util.bn(19.14),
        newDepth: util.bn('202084405946.38'),
        share: util.bn(46.46),
        Pr: util.bn(1),
        R: util.bn('108204400000'),
        T: util.bn('5654700000'),
      };

      const result: CalcResult = getCalcResult(
        'TCAN-014',
        poolData,
        poolAddress,
        runeAmount,
        runePrice,
        tAmount,
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
      const runeAmount = tokenAmount(809.29);
      const runePrice = util.bn(1);
      const tAmount = tokenAmount(0.14);
      const expected: CreatePoolCalc = {
        poolAddress: 'tbnb1XXX',
        tokenSymbol: 'TOMOB-1E1',
        poolPrice: util.bn('5780.64285714285714285714'),
        depth: util.bn(809.29),
        share: 100,
        Pr: util.bn(1),
      };
      const result = getCreatePoolCalc({
        tokenSymbol,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount: tAmount,
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
      const runeAmount = tokenAmount(3237.152);
      const runePrice = util.bn(1);
      const tAmount = tokenAmount(0.559);
      const expected: CreatePoolCalc = {
        poolAddress: 'tbnb1XXX',
        tokenSymbol: 'TOMOB-1E1',
        poolPrice: util.bn('5790.96958855098389982111'),
        depth: util.bn(3237.152),
        share: 100,
        Pr: util.bn(1),
      };
      const result = getCreatePoolCalc({
        tokenSymbol,
        poolAddress,
        runeAmount,
        runePrice,
        tokenAmount: tAmount,
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
});
