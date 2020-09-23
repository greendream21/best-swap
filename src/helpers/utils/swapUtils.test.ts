import { WS } from '@thorchain/asgardex-binance';
import { bn } from '@thorchain/asgardex-util';
import { tokenAmount, baseAmount } from '@thorchain/asgardex-token';
import {
  isValidSwap,
  parseTransfer,
  getTxResult,
  getValidSwapPairs,
  getSwapType,
  getSwapData,
  validateSwap,
  SwapErrorMsg,
} from './swapUtils';
import {
  PoolDetail,
  PoolDetailStatusEnum,
} from '../../types/generated/midgard';
import { AssetPair } from '../../types/bepswap';
import { PoolDataMap } from '../../redux/midgard/types';
import { SwapData } from './types';

import { RUNE_SYMBOL } from '../../settings/assetData';

const bnbPoolInfo: PoolDetail = {
  asset: 'BNB.BNB',
  assetDepth: '2224480142',
  assetROI: '0.030997470337411938',
  assetStakedTotal: '2157600000',
  buyAssetCount: '292',
  buyFeeAverage: '7060697414.182593',
  buyFeesTotal: '2061723644941',
  buySlipAverage: '0.020423287763786567',
  buyTxAverage: '2847231178.710591',
  buyVolume: '831391504183',
  poolDepth: '752064535802',
  poolFeeAverage: '6440609693.924242',
  poolFeesTotal: '2125401198995',
  poolROI: '0.6120802254729578',
  poolROI12: '0.6093876217266438',
  poolSlipAverage: '0.031693333633081765',
  poolStakedTotal: '536183263953',
  poolTxAverage: '4979658580.63162',
  poolUnits: '201288130514',
  poolVolume: '1391790523992',
  poolVolume24hr: '0',
  price: '169.04276230711346',
  runeDepth: '376032267901',
  runeROI: '1.1931629806085038',
  runeStakedTotal: '171456600000',
  sellAssetCount: '38',
  sellFeeAverage: '1675725106.6842105',
  sellFeesTotal: '63677554054',
  sellSlipAverage: '0.11829473873398169',
  sellTxAverage: '21365679669.077423',
  sellVolume: '560399019809',
  stakeTxCount: '12',
  stakersCount: '4',
  stakingTxCount: '12',
  status: PoolDetailStatusEnum.Enabled,
  swappersCount: '4',
  swappingTxCount: '330',
  withdrawTxCount: '0',
};

const lokPoolInfo: PoolDetail = {
  asset: 'BNB.LOK-3C0',
  assetDepth: '18796629752',
  assetROI: '0',
  assetStakedTotal: '18796629752',
  buyAssetCount: '0',
  buyFeeAverage: '0',
  buyFeesTotal: '0',
  buySlipAverage: '0',
  buyTxAverage: '-0',
  buyVolume: '0',
  poolDepth: '471588800000',
  poolFeeAverage: '0',
  poolFeesTotal: '0',
  poolROI: '0',
  poolROI12: '0',
  poolSlipAverage: '0',
  poolStakedTotal: '471588800000',
  poolTxAverage: '0',
  poolUnits: '104855161669',
  poolVolume: '0',
  poolVolume24hr: '0',
  price: '12.54450415372527',
  runeDepth: '235794400000',
  runeROI: '0',
  runeStakedTotal: '235794400000',
  sellAssetCount: '0',
  sellFeeAverage: '0',
  sellFeesTotal: '0',
  sellSlipAverage: '0',
  sellTxAverage: '0',
  sellVolume: '0',
  stakeTxCount: '6',
  stakersCount: '2',
  stakingTxCount: '6',
  status: PoolDetailStatusEnum.Enabled,
  swappersCount: '0',
  swappingTxCount: '0',
  withdrawTxCount: '0',
};

const poolData: PoolDataMap = {
  BNB: bnbPoolInfo,
  'LOK-3C0': lokPoolInfo,
};

const pools: string[] = [
  'BNB.LOK-3C0',
  'BNB.BOLT-E42',
  'BNB.FTM-585',
  'BNB.BNB',
  'BNB.TED-DF2',
  'BNB.TUSDB-000',
  'BNB.TCAN-014',
  'BNB.TATIC-E9C',
  'BNB.FSN-F1B',
];

describe('swap/utils/', () => {
  describe('isValidSwap', () => {
    it('should return false for source invalid pair', () => {
      expect(isValidSwap(pools, '', RUNE_SYMBOL)).toBeFalsy();
    });
    it('should return false for target invalid pair', () => {
      expect(isValidSwap(pools, RUNE_SYMBOL, '')).toBeFalsy();
    });
    it('should return false for invalid pair', () => {
      expect(isValidSwap(pools, RUNE_SYMBOL, RUNE_SYMBOL)).toBeFalsy();
    });
    it('should return false in case the asset is unlisted!', () => {
      expect(isValidSwap(pools, RUNE_SYMBOL, 'ETH')).toBeFalsy();
      expect(isValidSwap(pools, 'ETH', 'BTC')).toBeFalsy();
    });
    it('should return true for a valid pair', () => {
      expect(isValidSwap(pools, RUNE_SYMBOL, 'BNB')).toBeTruthy();
    });
    it('should return true for a valid pair', () => {
      expect(isValidSwap(pools, 'LOK-3C0', 'TUSDB-000')).toBeTruthy();
    });
  });

  describe('getValidSwapPairs', () => {
    it('should filter source and target data', () => {
      const assetInfo: AssetPair[] = [
        { asset: 'BNB.BNB' },
        { asset: 'BNB.BOLT-E42' },
        { asset: 'BNB.FTM-585' },
        { asset: 'BNB.LOK-3C0' },
        { asset: 'BNB.BTC' },
        { asset: 'BNB.ETH' },
      ];

      const poolInfo: AssetPair[] = [
        { asset: 'BNB.BNB' },
        { asset: 'BNB.BOLT-E42' },
        { asset: 'BNB.LOK-3C0' },
      ];

      const result = getValidSwapPairs(assetInfo, poolInfo, RUNE_SYMBOL, 'BNB');
      const expected = {
        sourceData: [
          { asset: 'BNB.BNB' },
          { asset: 'BNB.BOLT-E42' },
          { asset: 'BNB.LOK-3C0' },
        ],
        targetData: [{ asset: 'BNB.BOLT-E42' }, { asset: 'BNB.LOK-3C0' }],
      };
      expect(result).toEqual(expected);
    });

    it('shouldnt filter anything from empty pair', () => {
      const assetInfo: AssetPair[] = [
        { asset: 'BNB.BNB' },
        { asset: 'BNB.BOLT-E42' },
        { asset: 'BNB.FTM-585' },
        { asset: 'BNB.LOK-3C0' },
        { asset: 'BNB.BTC' },
        { asset: 'BNB.ETH' },
      ];

      const poolInfo: AssetPair[] = [
        { asset: 'BNB.BNB' },
        { asset: 'BNB.BOLT-E42' },
        { asset: 'BNB.LOK-3C0' },
      ];

      const result = getValidSwapPairs(assetInfo, poolInfo, '', '');
      const expected = {
        sourceData: poolInfo,
        targetData: poolInfo,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('parseTransfer', () => {
    it('should parse transfer event ', () => {
      const transferEvent: WS.TransferEvent = {
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
                  a: RUNE_SYMBOL,
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
        txToken: RUNE_SYMBOL,
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
  });

  describe('getTxResult', () => {
    it('should return a "refunded" TxResult', () => {
      const tx: WS.TransferEvent = {
        stream: '',
        data: {
          e: 'outboundTransferInfo',
          E: 62474260,
          H: 'DADB8F2F5CA0402C56B12E78AB48E6A57875B8CFA5E8652E5B72EF68CFBE3544',
          M: '',
          f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          t: [
            {
              o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
              c: [
                {
                  a: RUNE_SYMBOL,
                  A: '2.00000000',
                },
              ],
            },
          ],
        },
      };
      const address = 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad';
      const result = getTxResult({
        pair: {
          source: RUNE_SYMBOL,
          target: 'BNB',
        },
        tx,
        address,
      });
      const expected = {
        type: 'refund',
        token: RUNE_SYMBOL,
        amount: '2.00000000',
      };
      expect(result).toEqual(expected);
    });

    it('should return a "refunded" TxResult', () => {
      const tx: WS.TransferEvent = {
        stream: '',
        data: {
          e: 'outboundTransferInfo',
          E: 62475857,
          H: '92310CD29ED38769BA3996CABAB2FE4699BC2430913B521E2E7FF5AC48A9AB0D',
          M: '',
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
      const address = 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad';

      const result = getTxResult({
        pair: {
          source: RUNE_SYMBOL,
          target: 'TUSDB-000',
        },
        tx,
        address,
      });
      const expected = {
        type: 'success',
        token: 'TUSDB-000',
        amount: '0.12774141',
      };
      expect(result).toEqual(expected);
    });
  });

  describe('getSwapType', () => {
    it('returns sigle swap type', () => {
      const expected = 'single_swap';

      expect(getSwapType(RUNE_SYMBOL, 'BNB')).toEqual(expected);
      expect(getSwapType('BNB', RUNE_SYMBOL)).toEqual(expected);
    });

    it('returns double swap type', () => {
      const expected = 'double_swap';

      expect(getSwapType('BOLT', 'BNB')).toEqual(expected);
      expect(getSwapType('BNB', 'USDT')).toEqual(expected);
    });
  });

  describe('getSwapData', () => {
    const xValue = tokenAmount(100);
    const runePrice = bn(1);

    it('returns calculated result for single swap type: rune -> bnb', () => {
      const from = RUNE_SYMBOL;
      const to = 'BNB';
      const expected: SwapData = {
        Px: bn(1),
        fee: tokenAmount(0.0149273),
        slipLimit: baseAmount(39292030),
        outputAmount: tokenAmount(0.56131472),
        outputPrice: bn(178.03053227763760049641),
        slip: bn(2.59046),
        symbolFrom: RUNE_SYMBOL,
        symbolTo: 'BNB',
      };

      const result = getSwapData(from, to, poolData, xValue, runePrice);

      expect(result?.Px).toEqual(expected.Px);
      expect(result?.fee.amount()).toEqual(expected.fee.amount());
      expect(result?.slipLimit?.amount()).toEqual(expected.slipLimit?.amount());
      expect(result?.outputAmount.amount()).toEqual(
        expected.outputAmount.amount(),
      );
      expect(result?.outputPrice.toFixed(5)).toEqual(
        expected.outputPrice.toFixed(5),
      );
      expect(result?.slip.toFixed(5)).toEqual(expected.slip.toFixed(5));
      expect(result?.symbolFrom).toEqual(expected.symbolFrom);
      expect(result?.symbolTo).toEqual(expected.symbolTo);
    });
    it('returns calculated result for single swap type: lok -> rune', () => {
      const from = 'LOK-3C0';
      const to = RUNE_SYMBOL;
      const expected: SwapData = {
        Px: bn('6.3322188335020546053'),
        fee: tokenAmount('284.34798923'),
        slipLimit: baseAmount('37413487120'),
        outputAmount: tokenAmount('534.47838743'),
        outputPrice: bn('1.00000000000152525393'),
        slip: bn('34.726285979023202465'),
        symbolFrom: 'LOK-3C0',
        symbolTo: RUNE_SYMBOL,
      };
      const result = getSwapData(from, to, poolData, xValue, runePrice);

      expect(result?.Px).toEqual(expected.Px);
      expect(result?.fee.amount()).toEqual(expected.fee.amount());
      expect(result?.slipLimit?.amount()).toEqual(expected.slipLimit?.amount());
      expect(result?.outputAmount.amount()).toEqual(
        expected.outputAmount.amount(),
      );
      expect(result?.outputPrice).toEqual(expected.outputPrice);
      expect(result?.slip).toEqual(expected.slip);
      expect(result?.symbolFrom).toEqual(expected.symbolFrom);
      expect(result?.symbolTo).toEqual(expected.symbolTo);
    });
    it('returns calculated result for double swap type: lok -> bnb', () => {
      const from = 'LOK-3C0';
      const to = 'BNB';
      const expected: SwapData = {
        Px: bn('6.3322188335020546053'),
        fee: tokenAmount('0.34451071'),
        outputAmount: tokenAmount(2.42380508),
        outputPrice: bn('216.67937336595058369301'),
        slip: bn(47.17106),
        symbolFrom: 'LOK-3C0',
        symbolTo: 'BNB',
        slipLimit: baseAmount(169666356),
      };

      const result = getSwapData(from, to, poolData, xValue, runePrice);
      expect(result?.Px).toEqual(expected.Px);
      expect(result?.fee.amount()).toEqual(expected.fee.amount());
      expect(result?.slipLimit?.amount()).toEqual(expected.slipLimit?.amount());
      expect(result?.outputAmount.amount()).toEqual(
        expected.outputAmount.amount(),
      );
      expect(result?.outputPrice).toEqual(expected.outputPrice);
      expect(result?.slip.toFixed(5)).toEqual(expected.slip.toFixed(5));
      expect(result?.symbolFrom).toEqual(expected.symbolFrom);
      expect(result?.symbolTo).toEqual(expected.symbolTo);
    });
  });

  describe('validateSwap', () => {
    it('check wallet and amount', () => {
      // invalid wallet address
      expect(validateSwap('', tokenAmount(10))).toEqual(
        SwapErrorMsg.MISSING_WALLET,
      );
      // invalid amount
      expect(validateSwap('address', tokenAmount(0))).toEqual(
        SwapErrorMsg.INVALID_AMOUNT,
      );
    });
  });
});
