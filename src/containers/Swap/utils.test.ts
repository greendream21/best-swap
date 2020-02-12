import {
  parseTransfer,
  isOutboundTx,
  isRefundTx,
  getTxResult,
  validatePair,
  getSwapType,
  getSwapData,
  getCalcResult,
  validateSwap,
} from './utils';
import { TransferEvent, TransferEventData } from '../../types/binance';
import { PoolDetail, PoolDetailStatusEnum } from '../../types/generated/midgard';
import { Nothing } from '../../types/bepswap';
import { PoolDataMap } from '../../redux/midgard/types';
import { CalcResult } from './SwapSend/types';

const bnbPoolInfo: PoolDetail = {
  asset: 'BNB.BNB',
  assetDepth: -12500,
  assetROI: 184467440737094.38,
  assetStakedTotal: 100000,
  buyAssetCount: 0,
  buyFeeAverage: 0,
  buyFeesTotal: 0,
  buySlipAverage: 0,
  buyTxAverage: 0,
  buyVolume: 0,
  poolDepth: 200000,
  poolFeeAverage: 0,
  poolFeesTotal: 0,
  poolROI: 92233720368547.19,
  poolROI12: 92233720368547.19,
  poolSlipAverage: 0,
  poolStakedTotal: 0,
  poolTxAverage: 0,
  poolUnits: 50000,
  poolVolume: 0,
  poolVolume24hr: 0,
  price: 5.421010862427526e-15,
  runeDepth: 100000,
  runeROI: 0,
  runeStakedTotal: 0,
  sellAssetCount: 0,
  sellFeeAverage: 0,
  sellFeesTotal: 0,
  sellSlipAverage: 0,
  sellTxAverage: 0,
  sellVolume: 0,
  stakeTxCount: 1,
  stakersCount: 1,
  stakingTxCount: 1,
  status: PoolDetailStatusEnum.Enabled,
  swappersCount: 0,
  swappingTxCount: 0,
  withdrawTxCount: 0,
};

const lokPoolInfo: PoolDetail = {
  asset: 'BNB.LOK-3C0',
  assetDepth: 4283400000,
  assetROI: 0,
  assetStakedTotal: 4283400000,
  buyAssetCount: 0,
  buyFeeAverage: 0,
  buyFeesTotal: 0,
  buySlipAverage: 0,
  buyTxAverage: 0,
  buyVolume: 0,
  poolDepth: 7644800000,
  poolFeeAverage: 0,
  poolFeesTotal: 0,
  poolROI: 0,
  poolROI12: 0,
  poolSlipAverage: 0,
  poolStakedTotal: 7644800000,
  poolTxAverage: 0,
  poolUnits: 4052900000,
  poolVolume: 0,
  poolVolume24hr: 0,
  price: 0.8923752159499463,
  runeDepth: 3822400000,
  runeROI: 0,
  runeStakedTotal: 3822400000,
  sellAssetCount: 0,
  sellFeeAverage: 0,
  sellFeesTotal: 0,
  sellSlipAverage: 0,
  sellTxAverage: 0,
  sellVolume: 0,
  stakeTxCount: 1,
  stakersCount: 1,
  stakingTxCount: 1,
  status: PoolDetailStatusEnum.Enabled,
  swappersCount: 0,
  swappingTxCount: 0,
  withdrawTxCount: 0,
};

const poolData: PoolDataMap = {
  BNB: bnbPoolInfo,
  'LOK-3C0': lokPoolInfo,
};

const priceIndex = {
  RUNE: 1,
  LOK: 0.89,
  BNB: 0,
};

describe('swap/utils/', () => {
  describe('isOutboundTx', () => {
    it('should find an outbound tx ', () => {
      const transferEvent = {
        data: {
          M: 'OUTBOUND:anything',
        },
      };
      const result = isOutboundTx(transferEvent);
      expect(result).toBeTruthy();
    });

    it('should not find an outbound tx if now data available ', () => {
      const transferEvent = {};
      const result = isOutboundTx(transferEvent);
      expect(result).toBeFalsy();
    });
  });

  describe('isRefundTx', () => {
    it('should find a refund tx ', () => {
      const transferEvent = {
        data: {
          M: 'REFUND:anyhting',
        },
      };
      const result = isRefundTx(transferEvent);
      expect(result).toBeTruthy();
    });

    it('should not find refund tx if no data available', () => {
      const transferEvent = {};
      const result = isRefundTx(transferEvent);
      expect(result).toBeFalsy();
    });
  });

  describe('parseTransfer', () => {
    it('should parse transfer event ', () => {
      const transferEvent: TransferEvent = {
        stream: 'transfers',
        data: {
          e: 'outboundTransferInfo',
          E: 62469789,
          H: '270EDA8CF140052FCB54209190A8F2C53EC1E82F6F2C594BFD6C7CE82165A2BE',
          M: 'SWAP:TUSDB-000::18430000',
          f: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
          t: [
            {
              o: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
              c: [
                {
                  a: 'RUNE-A1F',
                  A: '2.00000000',
                },
              ],
            },
          ],
        },
      };
      const result = parseTransfer(transferEvent);
      const expected = {
        txHash:
          '270EDA8CF140052FCB54209190A8F2C53EC1E82F6F2C594BFD6C7CE82165A2BE',
        txMemo: 'SWAP:TUSDB-000::18430000',
        txFrom: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
        txTo: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
        txToken: 'RUNE-A1F',
        txAmount: '2.00000000',
      };
      expect(result).toEqual(expected);
    });

    it('can not parse anything if an event does not include any `data` ', () => {
      const transferEvent = {};
      const result = parseTransfer(transferEvent);
      const expected = {
        txHash: undefined,
        txMemo: undefined,
        txFrom: undefined,
        txTo: undefined,
        txToken: undefined,
        txAmount: undefined,
      };

      expect(result).toEqual(expected);
    });

    it('can not parse anything if event includes an empty payload` ', () => {
      const result = parseTransfer({ data: ({} as TransferEventData) });
      const expected = {
        txHash: undefined,
        txMemo: undefined,
        txFrom: undefined,
        txTo: undefined,
        txToken: undefined,
        txAmount: undefined,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getTxResult', () => {
    it('should return a "refunded" TxResult', () => {
      const tx: TransferEvent = {
        stream: '',
        data: {
          e: 'outboundTransferInfo',
          E: 62474260,
          H: 'DADB8F2F5CA0402C56B12E78AB48E6A57875B8CFA5E8652E5B72EF68CFBE3544',
          M:
            'REFUND:3B484D9FF242B2378800872B42B39940F22313A12149F0D7933A607189C41E67',
          f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          t: [
            {
              o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
              c: [
                {
                  a: 'RUNE-A1F',
                  A: '2.00000000',
                },
              ],
            },
          ],
        },
      };
      const result = getTxResult({
        tx,
        hash:
          '3B484D9FF242B2378800872B42B39940F22313A12149F0D7933A607189C41E67',
      });
      const expected = {
        type: 'refund',
        token: 'RUNE-A1F',
        amount: '2.00000000',
      };
      expect(result).toEqual(expected);
    });

    it('should return a "refunded" TxResult', () => {
      const tx: TransferEvent = {
        stream: '',
        data: {
          e: 'outboundTransferInfo',
          E: 62475857,
          H: '92310CD29ED38769BA3996CABAB2FE4699BC2430913B521E2E7FF5AC48A9AB0D',
          M:
            'OUTBOUND:5782DB87AAD0CDBB01D6429D1CF9F9E0C49AD347FA54A10D6F6D26250C99F280',
          f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          t: [
            {
              o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
              c: [
                {
                  a: 'TUSDB-000',
                  A: '0.12774141',
                },
              ],
            },
          ],
        },
      };
      const result = getTxResult({
        tx,
        hash:
          '5782DB87AAD0CDBB01D6429D1CF9F9E0C49AD347FA54A10D6F6D26250C99F280',
      });
      const expected = {
        type: 'success',
        token: 'TUSDB-000',
        amount: '0.12774141',
      };
      expect(result).toEqual(expected);
    });
  });

  describe('validatePair', () => {
    it('should filter source and target data', () => {
      const pair = { source: 'A', target: 'B' };
      const sources = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const targets = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const result = validatePair(pair, sources, targets);
      const expected = {
        sourceData: [{ asset: 'B-C' }, { asset: 'C-D' }],
        targetData: [{ asset: 'A-B' }, { asset: 'C-D' }],
      };
      expect(result).toEqual(expected);
    });

    it('should not filter anything if pair are unknown', () => {
      const pair = {};
      const sources = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const targets = [{ asset: 'A-B' }, { asset: 'B-C' }, { asset: 'C-D' }];
      const result = validatePair(pair, sources, targets);
      const expected = {
        sourceData: [...sources],
        targetData: [...targets],
      };
      expect(result).toEqual(expected);
    });
  });

  describe('getSwapType', () => {
    it('returns sigle swap type', () => {
      const expected = 'single_swap';

      expect(getSwapType('RUNE', 'BNB')).toEqual(expected);
      expect(getSwapType('BNB', 'RUNE')).toEqual(expected);
    });

    it('returns double swap type', () => {
      const expected = 'double_swap';

      expect(getSwapType('BOLT', 'BNB')).toEqual(expected);
      expect(getSwapType('BNB', 'USDT')).toEqual(expected);
    });
  });

  describe('getSwapData', () => {
    const from = 'rune';
    const basePriceAsset = 'RUNE';

    it('returns swap data', () => {
      const expected = {
        depth: 'RUNE 38.22',
        pool: { asset: 'rune', target: 'LOK' },
        raw: { depth: 38.22, slip: 0, trade: 0, transaction: 0, volume: 0 },
        slip: '0',
        trade: '0',
        transaction: 'RUNE 0',
        volume: 'RUNE 0',
      };

      expect(
        getSwapData(from, lokPoolInfo, priceIndex, basePriceAsset),
      ).toEqual(expected);
    });

    it('returns null', () => {
      const expected = null;

      expect(getSwapData(from, Nothing, priceIndex, basePriceAsset)).toEqual(
        expected,
      );
    });
  });

  describe('getCalcResult', () => {
    const poolAddress = 'address';
    const xValue = 100;
    const runePrice = 1;

    it('returns calculated result for sigle swap type: rune -> bnb', () => {
      const from = 'rune';
      const to = 'bnb';
      const expected = {
        Px: 1,
        fee: 0,
        lim: 0,
        outputAmount: 0,
        outputPrice: 100000,
        poolAddressTo: 'address',
        poolRatio: Infinity,
        slip: Infinity,
        symbolFrom: 'RUNE-A1F',
        symbolTo: 'BNB',
      };

      expect(
        getCalcResult(from, to, poolData, poolAddress, xValue, runePrice),
      ).toEqual(expected);
    });
    it('returns calculated result for sigle swap type: lok -> rune', () => {
      const from = 'lok';
      const to = 'rune';
      const expected = {
        Px: 0.21142511316122778,
        fee: 18.74,
        lim: 778910000,
        outputAmount: 8.03,
        outputPrice: 1,
        poolAddressTo: 'address',
        poolRatio: 0.8923752159499462,
        slip: 1012,
        symbolFrom: 'LOK-3C0',
        symbolTo: 'RUNE-A1F',
      };

      expect(
        getCalcResult(from, to, poolData, poolAddress, xValue, runePrice),
      ).toEqual(expected);
    });
    it('returns calculated result for double swap type: lok -> bnb', () => {
      const from = 'lok';
      const to = 'bnb';
      const expected = {
        Px: 0.21142511316122778,
        fee: 0,
        outputAmount: 0,
        outputPrice: 8025.31,
        poolAddressFrom: 'address',
        poolAddressTo: 'address',
        poolRatio: Infinity,
        slip: 100,
        symbolFrom: 'LOK-3C0',
        symbolTo: 'BNB',
      };

      expect(
        getCalcResult(from, to, poolData, poolAddress, xValue, runePrice),
      ).toEqual(expected);
    });
  });

  describe('validateSwap', () => {
    const data: Partial<CalcResult> = {
      poolAddressFrom: 'value',
      symbolFrom: 'value',
      poolAddressTo: 'value',
      symbolTo: 'value',
    };

    it('returns invalid in the single swap', () => {
      expect(validateSwap('', 'single_swap', data, 10)).toEqual(false);
      expect(validateSwap('address', 'single_swap', data, 0)).toEqual(false);
    });
    it('returns valid in the single swap', () => {
      expect(validateSwap('address', 'single_swap', data, 10)).toEqual(true);
    });
    it('returns invalid in the double swap', () => {
      expect(validateSwap('', 'double_swap', data, 10)).toEqual(false);
      expect(validateSwap('address', 'double_swap', data, 0)).toEqual(false);
    });
    it('returns valid in the double swap', () => {
      expect(validateSwap('address', 'double_swap', data, 10)).toEqual(true);
    });
  });
});
