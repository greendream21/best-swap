import { TransferEvent, TransferEventData } from '@thorchain/asgardex-binance';
import { bn } from '@thorchain/asgardex-util';
import { tokenAmount, baseAmount } from '@thorchain/asgardex-token';
import {
  isValidSwap,
  parseTransfer,
  getTxResult,
  validatePair,
  getSwapType,
  getCalcResult,
  validateSwap,
  SwapErrorMsg,
} from './utils';
import {
  PoolDetail,
  PoolDetailStatusEnum,
} from '../../types/generated/midgard';
import { Nothing, Pair, AssetPair, SwapType } from '../../types/bepswap';
import { PoolDataMap } from '../../redux/midgard/types';
import { CalcResult } from './SwapSend/types';

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
      const sourceInvalidPair: Pair = {
        source: '',
        target: 'rune',
      };
      expect(isValidSwap(sourceInvalidPair, pools)).toBeFalsy();
    });
    it('should return false for target invalid pair', () => {
      const targetInvalidPair: Pair = {
        source: 'rune',
        target: '',
      };
      expect(isValidSwap(targetInvalidPair, pools)).toBeFalsy();
    });
    it('should return false for invalid pair', () => {
      const invalidPair: Pair = {
        source: 'rune',
        target: 'rune',
      };
      expect(isValidSwap(invalidPair, pools)).toBeFalsy();
    });
    it('should return false in case the asset is unlisted!', () => {
      const invalidPair: Pair = {
        source: 'rune',
        target: 'btc',
      };
      const invalidPair2: Pair = {
        source: 'eth',
        target: 'btc',
      };
      expect(isValidSwap(invalidPair, pools)).toBeFalsy();
      expect(isValidSwap(invalidPair2, pools)).toBeFalsy();
    });
    it('should return true for a valid pair', () => {
      const validPair: Pair = {
        source: 'rune',
        target: 'bnb',
      };
      expect(isValidSwap(validPair, pools)).toBeTruthy();
    });
    it('should return true for a valid pair', () => {
      const validPair: Pair = {
        source: 'lok',
        target: 'tusdb',
      };
      expect(isValidSwap(validPair, pools)).toBeTruthy();
    });
  });

  describe('validatePair', () => {
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
      const pair = { source: 'rune', target: 'bnb' };

      const result = validatePair(pair, assetInfo, poolInfo);
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
      const pair = { source: '', target: '' };

      const result = validatePair(pair, assetInfo, poolInfo);
      const expected = {
        sourceData: poolInfo,
        targetData: poolInfo,
      };
      expect(result).toEqual(expected);
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
      const result = parseTransfer({ data: {} as TransferEventData });
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
          M: '',
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
      const address = 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad';
      const result = getTxResult({
        pair: {
          source: 'rune',
          target: 'bnb',
        },
        tx,
        address,
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
          source: 'rune',
          target: 'tusdb',
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

      expect(getSwapType('RUNE', 'BNB')).toEqual(expected);
      expect(getSwapType('BNB', 'RUNE')).toEqual(expected);
    });

    it('returns double swap type', () => {
      const expected = 'double_swap';

      expect(getSwapType('BOLT', 'BNB')).toEqual(expected);
      expect(getSwapType('BNB', 'USDT')).toEqual(expected);
    });
  });

  describe('getCalcResult', () => {
    const poolAddress = 'address';
    const xValue = tokenAmount(100);
    const runePrice = bn(1);

    it('returns calculated result for single swap type: rune -> bnb', () => {
      const from = 'rune';
      const to = 'bnb';
      const expected: CalcResult = {
        Px: bn(1),
        fee: tokenAmount(0.0149273),
        lim: baseAmount(544475),
        outputAmount: tokenAmount(0.56131472),
        outputPrice: bn(178.03053227763760049641),
        poolAddressTo: 'address',
        poolAddressFrom: Nothing,
        slip: bn(5.389413716466187631),
        symbolFrom: 'RUNE-A1F',
        symbolTo: 'BNB',
      };

      const result = getCalcResult(
        from,
        to,
        poolData,
        poolAddress,
        xValue,
        runePrice,
      );

      expect(result?.Px).toEqual(expected.Px);
      expect(result?.fee.amount()).toEqual(expected.fee.amount());
      expect(result?.lim?.amount()).toEqual(expected.lim?.amount());
      expect(result?.outputAmount.amount()).toEqual(
        expected.outputAmount.amount(),
      );
      expect(result?.outputPrice.toFixed(5)).toEqual(
        expected.outputPrice.toFixed(5),
      );
      expect(result?.poolAddressTo).toEqual(expected.poolAddressTo);
      expect(result?.poolAddressFrom).toEqual(expected.poolAddressFrom);
      expect(result?.slip.toFixed(5)).toEqual(expected.slip.toFixed(5));
      expect(result?.symbolFrom).toEqual(expected.symbolFrom);
      expect(result?.symbolTo).toEqual(expected.symbolTo);
    });
    it('returns calculated result for single swap type: lok -> rune', () => {
      const from = 'lok';
      const to = 'rune';
      const expected: CalcResult = {
        Px: bn('6.3322188335020546053'),
        fee: tokenAmount('284.34798923'),
        lim: baseAmount('51844403581'),
        outputAmount: tokenAmount('534.47838743'),
        outputPrice: bn('1.00000000000152525393'),
        poolAddressFrom: Nothing,
        poolAddressTo: 'address',
        slip: bn('134.705545606424204104'),
        symbolFrom: 'LOK-3C0',
        symbolTo: 'RUNE-A1F',
      };
      const result = getCalcResult(
        from,
        to,
        poolData,
        poolAddress,
        xValue,
        runePrice,
      );

      expect(result?.Px).toEqual(expected.Px);
      expect(result?.fee.amount()).toEqual(expected.fee.amount());
      expect(result?.lim?.amount()).toEqual(expected.lim?.amount());
      expect(result?.outputAmount.amount()).toEqual(
        expected.outputAmount.amount(),
      );
      expect(result?.outputPrice).toEqual(expected.outputPrice);
      expect(result?.poolAddressTo).toEqual(expected.poolAddressTo);
      expect(result?.poolAddressFrom).toEqual(expected.poolAddressFrom);
      expect(result?.slip).toEqual(expected.slip);
      expect(result?.symbolFrom).toEqual(expected.symbolFrom);
      expect(result?.symbolTo).toEqual(expected.symbolTo);
    });
    it('returns calculated result for double swap type: lok -> bnb', () => {
      const from = 'lok';
      const to = 'bnb';
      const expected: CalcResult = {
        Px: bn('6.3322188335020546053'),
        fee: tokenAmount('0.34451071'),
        outputAmount: tokenAmount(2.42380508),
        outputPrice: bn('216.67937336595058369301'),
        poolAddressFrom: 'address',
        poolAddressTo: 'address',
        slip: bn(23.340828117376259007),
        symbolFrom: 'LOK-3C0',
        symbolTo: 'BNB',
        lim: Nothing,
      };

      const result = getCalcResult(
        from,
        to,
        poolData,
        poolAddress,
        xValue,
        runePrice,
      );
      expect(result?.Px).toEqual(expected.Px);
      expect(result?.fee.amount()).toEqual(expected.fee.amount());
      expect(result?.lim?.amount()).toEqual(expected.lim?.amount());
      expect(result?.outputAmount.amount()).toEqual(
        expected.outputAmount.amount(),
      );
      expect(result?.outputPrice).toEqual(expected.outputPrice);
      expect(result?.poolAddressTo).toEqual(expected.poolAddressTo);
      expect(result?.poolAddressFrom).toEqual(expected.poolAddressFrom);
      expect(result?.slip.toFixed(5)).toEqual(expected.slip.toFixed(5));
      expect(result?.symbolFrom).toEqual(expected.symbolFrom);
      expect(result?.symbolTo).toEqual(expected.symbolTo);
    });
  });

  describe('validateSwap', () => {
    const data: Partial<CalcResult> = {
      poolAddressFrom: 'value',
      symbolFrom: 'value',
      poolAddressTo: 'value',
      symbolTo: 'value',
    };

    it('checks an invalid single swap', () => {
      // invalid wallet address
      expect(
        validateSwap('', SwapType.SINGLE_SWAP, data, tokenAmount(10)),
      ).toEqual(SwapErrorMsg.MISSING_WALLET);
      // invalid amount
      expect(
        validateSwap('address', SwapType.SINGLE_SWAP, data, tokenAmount(0)),
      ).toEqual(SwapErrorMsg.INVALID_AMOUNT);
      // invalid poolAddresTo
      expect(
        validateSwap(
          'address',
          SwapType.SINGLE_SWAP,
          { ...data, poolAddressTo: undefined },
          tokenAmount(10),
        ),
      ).toEqual(SwapErrorMsg.MISSING_ADDRESS_TO);
      // invalid symbolTo
      expect(
        validateSwap(
          'address',
          SwapType.SINGLE_SWAP,
          { ...data, symbolTo: undefined },
          tokenAmount(10),
        ),
      ).toEqual(SwapErrorMsg.MISSING_SYMBOL_TO);
    });
    it('checks a valid single swap', () => {
      expect(
        validateSwap('address', SwapType.SINGLE_SWAP, data, tokenAmount(10)),
      ).toBeNothing();
    });
    it('checks an invalid double swap', () => {
      // invalid wallet address
      expect(
        validateSwap('', SwapType.DOUBLE_SWAP, data, tokenAmount(10)),
      ).toEqual(SwapErrorMsg.MISSING_WALLET);
      // invalid amount
      expect(
        validateSwap('address', SwapType.DOUBLE_SWAP, data, tokenAmount(0)),
      ).toEqual(SwapErrorMsg.INVALID_AMOUNT);
      // invalid poolAddresTo
      expect(
        validateSwap(
          'address',
          SwapType.DOUBLE_SWAP,
          { ...data, poolAddressTo: undefined },
          tokenAmount(10),
        ),
      ).toEqual(SwapErrorMsg.MISSING_ADDRESS_TO);
      // invalid poolAddressFrom
      expect(
        validateSwap(
          'address',
          SwapType.DOUBLE_SWAP,
          { ...data, poolAddressFrom: undefined },
          tokenAmount(10),
        ),
      ).toEqual(SwapErrorMsg.MISSING_ADDRESS_FROM);
      // invalid symbolfrom
      expect(
        validateSwap(
          'address',
          SwapType.DOUBLE_SWAP,
          { ...data, symbolFrom: undefined },
          tokenAmount(10),
        ),
      ).toEqual(SwapErrorMsg.MISSING_SYMBOL_FROM);
    });
    it('checks a valid double swap', () => {
      expect(
        validateSwap('address', SwapType.DOUBLE_SWAP, data, tokenAmount(10)),
      ).toBeNothing();
    });
  });
});
