import { getSwapMemo } from '../../helpers/memoHelper';
import {
  getTickerFormat,
  getFixedNumber,
  getUserFormat,
} from '../../helpers/stringHelper';
import { getZValue, getPx, getPz, getSlip, getFee } from './calc';
import { BASE_NUMBER } from '../../settings/constants';
import { getTxHashFromMemo } from '../../helpers/binance';
import { PriceDataIndex, PoolDataMap } from '../../redux/midgard/types';
import { PoolDetail } from '../../types/generated/midgard';
import { FixmeType, Nothing, Maybe, Pair } from '../../types/bepswap';
import {
  TransferResult,
  TransferEvent,
  TransferEventData,
} from '../../types/binance';
import { CalcResult } from './SwapSend/types';
import { getAssetFromString } from '../../redux/midgard/utils';
import { SwapCardType } from './SwapView/types';

export const validatePair = (
  pair: Pair,
  sourceInfo: { asset: string }[],
  targetInfo: { asset: string }[],
) => {
  const { target = '', source = '' }: Pair = pair;
  const targetData = targetInfo.filter(
    (data: { asset: string }) =>
      getTickerFormat(data.asset) !== target?.toLowerCase(),
  );
  const sourceData = sourceInfo.filter(
    (data: { asset: string }) =>
      getTickerFormat(data.asset) !== source?.toLowerCase(),
  );
  return {
    sourceData,
    targetData,
  };
};

export const getSwapType = (from: string, to: string) => {
  if (from.toLowerCase() === 'rune' || to.toLowerCase() === 'rune') {
    return 'single_swap';
  }
  return 'double_swap';
};

export const getSwapData = (
  from: string,
  poolInfo: Maybe<PoolDetail>,
  priceIndex: PriceDataIndex,
  basePriceAsset: string,
): Maybe<SwapCardType> => {
  const asset = from;

  if (poolInfo) {
    const { ticker: target = '' } = getAssetFromString(poolInfo?.asset);

    const runePrice = priceIndex.RUNE;
    const depth = Number(poolInfo.runeDepth) * runePrice;
    const volume = (poolInfo?.poolVolume24hr ?? 0) * runePrice;
    const transaction = (poolInfo?.poolTxAverage ?? 0) * runePrice;
    const slip = (poolInfo.poolSlipAverage ?? 0) * runePrice;
    const trade = poolInfo?.swappingTxCount ?? 0;

    const depthValue = `${basePriceAsset} ${getUserFormat(
      depth,
    ).toLocaleString()}`;
    const volumeValue = `${basePriceAsset} ${getUserFormat(volume)}`;
    const transactionValue = `${basePriceAsset} ${getUserFormat(transaction)}`;
    const slipValue = `${slip}`;
    const tradeValue = `${trade}`;

    return {
      pool: {
        asset,
        target,
      },
      depth: depthValue,
      volume: volumeValue,
      transaction: transactionValue,
      slip: slipValue,
      trade: tradeValue,
      raw: {
        depth: getUserFormat(depth),
        volume: getUserFormat(volume),
        transaction: getUserFormat(transaction),
        slip,
        trade,
      },
    };
  } else {
    return null;
  }
};

export const getCalcResult = (
  from: string,
  to: string,
  pools: PoolDataMap,
  poolAddress: string,
  xValue: number,
  runePrice: number,
): Maybe<CalcResult> => {
  const type = getSwapType(from, to);

  const result: {
    poolAddressFrom?: string;
    poolAddressTo?: string;
    symbolFrom?: string;
    symbolTo?: string;
    poolRatio?: number;
  } = {};

  if (type === 'double_swap') {
    let X = 10000;
    let Y = 10;
    let R = 10000;
    let Z = 10;
    const Py = runePrice;

    // CHANGELOG:
    /*
      balance_rune => runeStakedTotal
      balance_token => assetStakedTotal
    */
    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const runeStakedTotal = poolData?.runeStakedTotal ?? 0;
      const assetStakedTotal = poolData?.assetStakedTotal ?? 0;
      const { symbol = '' } = getAssetFromString(poolData?.asset);

      const token = getTickerFormat(symbol);
      if (token.toLowerCase() === from.toLowerCase()) {
        X = Number(assetStakedTotal / BASE_NUMBER);
        Y = Number(runeStakedTotal / BASE_NUMBER);
        result.poolAddressFrom = poolAddress;
        result.symbolFrom = symbol;
      }

      if (token.toLowerCase() === to.toLowerCase()) {
        R = Number(runeStakedTotal / BASE_NUMBER);
        Z = Number(assetStakedTotal / BASE_NUMBER);
        result.poolAddressTo = poolAddress;
        result.symbolTo = symbol;
      }
    });
    result.poolRatio = (Z / R / Y) * X;

    const calcData = { X, Y, R, Z, Py, Pr: Py };

    const zValue = Number(getZValue(xValue, calcData).toFixed(2));
    const slip = getFixedNumber(getSlip(xValue, calcData), 0);
    const Px = getPx(xValue, calcData);
    const Pz = Number(getPz(xValue, calcData).toFixed(2));
    const fee = getFixedNumber(getFee(xValue, calcData));

    return {
      ...result,
      Px,
      slip,
      outputAmount: zValue,
      outputPrice: Pz,
      fee,
    };
  }

  if (type === 'single_swap' && to.toLowerCase() === 'rune') {
    let X = 10;
    let Y = 10;
    const Py = runePrice;
    const rune = 'RUNE-A1F';

    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const runeStakedTotal = poolData?.runeStakedTotal ?? 0;
      const assetStakedTotal = poolData?.assetStakedTotal ?? 0;
      const { symbol = '' } = getAssetFromString(poolData?.asset);

      const token = getTickerFormat(symbol);
      if (token.toLowerCase() === from.toLowerCase()) {
        X = Number(assetStakedTotal / BASE_NUMBER);
        Y = Number(runeStakedTotal / BASE_NUMBER);
        result.poolRatio = Y / X;

        result.poolAddressTo = poolAddress;
        result.symbolFrom = symbol;
      }
    });

    result.symbolTo = rune;
    const calcData = { X, Y, Py };

    const Px = getPx(xValue, calcData);
    const times = (xValue + X) ** 2;
    const xTimes = xValue ** 2;
    const balanceTimes = X ** 2;
    const outputToken = Number(((xValue * X * Y) / times).toFixed(2));
    const outputPy = Number(
      ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2),
    );
    // const input = xValue * Px;
    // const output = outputToken * outputPy;
    // const priceSlip = Math.round(
    //   (xTimes / (xTimes + X * xValue + balanceTimes)) * 100,
    // );

    // calc trade slip
    const slip = Math.round(((xValue * (2 * X + xValue)) / balanceTimes) * 100);
    const lim = Math.round((1 - 3 / 100) * outputToken * BASE_NUMBER);
    const fee = getFixedNumber((xTimes * Y) / times);

    return {
      ...result,
      Px,
      slip,
      outputAmount: outputToken,
      outputPrice: outputPy,
      lim,
      fee,
    };
  }

  if (type === 'single_swap' && from.toLowerCase() === 'rune') {
    let X = 10000;
    let Y = 10;
    const Px = runePrice;
    const rune = 'RUNE-A1F';

    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const runeStakedTotal = poolData?.runeStakedTotal ?? 0;
      const assetStakedTotal = poolData?.assetStakedTotal ?? 0;
      const { symbol = '' } = getAssetFromString(poolData?.asset);

      const token = getTickerFormat(symbol);
      if (token.toLowerCase() === to.toLowerCase()) {
        X = Number(runeStakedTotal / BASE_NUMBER);
        Y = Number(assetStakedTotal / BASE_NUMBER);
        result.poolRatio = Y / X;

        result.poolAddressTo = poolAddress;
        result.symbolTo = symbol;
      }
    });

    // Set RUNE for fromToken as we don't have rune in the pool from thorchain
    result.symbolFrom = rune;

    const times = (xValue + X) ** 2;
    const xTimes = xValue ** 2;
    const balanceTimes = X ** 2;
    const outputToken = Number(((xValue * X * Y) / times).toFixed(2));
    const outputPy = Number(
      ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2),
    );
    // const input = xValue * Px;
    // const output = outputToken * outputPy;

    // const priceSlip = Math.round(
    //   (xTimes / (xTimes + X * xValue + balanceTimes)) * 100,
    // );

    // trade slip
    const slip = Math.round(((xValue * (2 * X + xValue)) / balanceTimes) * 100);

    const lim = Math.round((1 - 3 / 100) * outputToken * BASE_NUMBER);
    const fee = getFixedNumber((xTimes * Y) / times);
    return {
      ...result,
      Px,
      slip,
      outputAmount: outputToken,
      outputPrice: outputPy,
      lim,
      fee,
    };
  }

  return Nothing;
};

export const validateSwap = (
  wallet: string,
  type: string,
  data: Partial<CalcResult>,
  amount: number,
) => {
  if (type === 'single_swap') {
    const symbolTo = data?.symbolTo;
    if (!wallet || !symbolTo || !amount) {
      return false;
    }
  }
  if (type === 'double_swap') {
    const poolAddressFrom = data?.poolAddressFrom;
    const symbolFrom = data?.symbolFrom;
    const poolAddressTo = data?.poolAddressTo;
    const symbolTo = data?.symbolTo;

    if (
      !wallet ||
      !poolAddressFrom ||
      !symbolFrom ||
      !poolAddressTo ||
      !symbolTo ||
      !amount
    ) {
      return false;
    }
  }
  return true;
};

export const confirmSwap = (
  Binance: FixmeType,
  wallet: string,
  from: string,
  to: string,
  data: CalcResult,
  amount: number,
  protectSlip: boolean,
  destAddr = '',
): Promise<TransferResult> => {
  return new Promise((resolve, reject) => {
    const type = getSwapType(from, to);

    if (!validateSwap(wallet, type, data, amount)) {
      return reject();
    }

    const { poolAddressTo, symbolTo, symbolFrom, lim } = data;

    const limit = protectSlip && lim ? lim.toString() : '';
    const memo = getSwapMemo(symbolTo, destAddr, limit);
    Binance.transfer(wallet, poolAddressTo, amount, symbolFrom, memo)
      .then((response: TransferResult) => resolve(response))
      .catch((error: Error) => reject(error));
  });
};

export const parseTransfer = (tx?: Pick<TransferEvent, 'data'>) => {
  const txHash = tx?.data?.H;
  const txMemo = tx?.data?.M;
  const txFrom = tx?.data?.f;
  const t = tx?.data?.t ?? [];
  const txTo = t[0]?.o;
  const c = t[0]?.c ?? [];
  const txAmount = c[0]?.A;
  const txToken = c[0]?.a;

  return {
    txHash,
    txMemo,
    txFrom,
    txTo,
    txToken,
    txAmount,
  };
};

export const isOutboundTx = (tx?: { data?: Pick<TransferEventData, 'M'> }) =>
  tx?.data?.M?.toUpperCase().includes('OUTBOUND') ?? false;

export const isRefundTx = (tx?: { data?: Pick<TransferEventData, 'M'> }) =>
  tx?.data?.M?.toUpperCase().includes('REFUND') ?? false;

export const getTxResult = ({
  tx,
  hash,
}: {
  tx: TransferEvent;
  hash: string;
}) => {
  const { txToken, txAmount } = parseTransfer(tx);

  if (isRefundTx(tx) && getTxHashFromMemo(tx) === hash) {
    return {
      type: 'refund',
      amount: txAmount,
      token: txToken,
    };
  }

  if (isOutboundTx(tx) && getTxHashFromMemo(tx) === hash) {
    return {
      type: 'success',
      amount: txAmount,
      token: txToken,
    };
  }

  return null;
};
