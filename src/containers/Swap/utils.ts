import BigNumber from 'bignumber.js';
import {
  TransferResult,
  TransferEvent,
  BinanceClient,
} from '@thorchain/asgardex-binance';
import { validBNOrZero, bn, isValidBN } from '@thorchain/asgardex-util';
import {
  TokenAmount,
  tokenAmount,
  baseToToken,
  baseAmount,
  tokenToBase,
  formatBaseAsTokenAmount,
} from '@thorchain/asgardex-token';
import { getSwapMemo } from '../../helpers/memoHelper';
import { getTickerFormat } from '../../helpers/stringHelper';
import {
  getZValue,
  getPx,
  getPz,
  getSlip,
  getFee,
  SingleSwapCalcData,
  DoubleSwapCalcData,
} from './calc';
import { PriceDataIndex, PoolDataMap } from '../../redux/midgard/types';
import { PoolDetail } from '../../types/generated/midgard';
import { Nothing, Maybe, SwapType, Pair, AssetPair } from '../../types/bepswap';
import { CalcResult } from './SwapSend/types';
import { getAssetFromString } from '../../redux/midgard/utils';
import { SwapCardType } from './SwapView/types';

export const validatePair = (
  pair: Pair,
  sourceInfo: AssetPair[],
  targetInfo: AssetPair[],
) => {
  const { source = '', target = '' }: Pair = pair;
  const poolAssets = targetInfo.map(data => getTickerFormat(data.asset));
  const sourceData = sourceInfo.filter((data: AssetPair) => {
    const ticker = getTickerFormat(data.asset);
    return ticker !== source?.toLowerCase() && poolAssets.includes(ticker);
  });
  const targetData = targetInfo.filter(
    (data: AssetPair) => getTickerFormat(data.asset) !== target?.toLowerCase(),
  );
  return {
    sourceData,
    targetData,
  };
};

export const isValidSwap = (pair: Pair, pools: string[]) => {
  const { target = '', source = '' }: Pair = pair;
  const RUNE = 'rune';
  const poolTickers = pools.map(poolSymbol => getTickerFormat(poolSymbol));
  poolTickers.push(RUNE);

  if (target === source || !target || !source) {
    return false;
  }

  if (!poolTickers.includes(source) || !poolTickers.includes(target)) {
    return false;
  }

  return true;
};

export const getSwapType = (from: string, to: string) =>
  from.toLowerCase() === 'rune' || to.toLowerCase() === 'rune'
    ? SwapType.SINGLE_SWAP
    : SwapType.DOUBLE_SWAP;

// TODO(Chris): merge duplicated functions from swap and pool utils
// TODO(Chris): Refactor utils

export const getSwapData = (
  from: string,
  poolInfo: Maybe<PoolDetail>,
  priceIndex: PriceDataIndex,
  basePriceAsset: string,
): Maybe<SwapCardType> => {
  const asset = from;

  if (poolInfo) {
    const { ticker: target = '' } = getAssetFromString(poolInfo?.asset);

    const runePrice = validBNOrZero(priceIndex?.RUNE);

    const poolPrice = validBNOrZero(priceIndex[target.toUpperCase()]);
    const poolPriceString = `${basePriceAsset} ${poolPrice.toFixed(3)}`;

    // formula: poolInfo.runeDepth * runePrice
    const depth = bn(poolInfo?.runeDepth ?? 0).multipliedBy(runePrice);
    const depthAsString = `${basePriceAsset} ${formatBaseAsTokenAmount(
      baseAmount(depth),
    )}`;
    // formula: poolInfo.poolVolume24hr * runePrice
    const volume = bn(poolInfo?.poolVolume24hr ?? 0).multipliedBy(runePrice);
    const volumeAsString = `${basePriceAsset} ${formatBaseAsTokenAmount(
      baseAmount(volume),
    )}`;
    // formula: poolInfo.poolTxAverage * runePrice
    const transaction = bn(poolInfo?.poolTxAverage ?? 0).multipliedBy(
      runePrice,
    );
    const transactionAsString = `${basePriceAsset} ${formatBaseAsTokenAmount(
      baseAmount(transaction),
    )}`;
    // formula: poolInfo.poolSlipAverage * runePrice
    const slip = bn(poolInfo?.poolSlipAverage ?? 0).multipliedBy(runePrice);
    const slipAsString = slip.toString();
    const trade = bn(poolInfo?.swappingTxCount ?? 0);
    const tradeAsString = trade.toString();

    return {
      pool: {
        asset,
        target,
      },
      poolPrice: poolPriceString,
      depth: depthAsString,
      volume: volumeAsString,
      transaction: transactionAsString,
      slip: slipAsString,
      trade: tradeAsString,
      raw: {
        depth,
        volume,
        transaction,
        slip,
        trade,
        poolPrice,
      },
    };
  } else {
    return Nothing;
  }
};

export const getCalcResult = (
  from: string,
  to: string,
  pools: PoolDataMap,
  poolAddress: string,
  xValue: TokenAmount,
  runePrice: BigNumber,
): Maybe<CalcResult> => {
  const swapType = getSwapType(from, to);

  const result: {
    poolAddressFrom: Maybe<string>;
    poolAddressTo: Maybe<string>;
    symbolFrom: Maybe<string>;
    symbolTo: Maybe<string>;
  } = {
    poolAddressFrom: Nothing,
    poolAddressTo: Nothing,
    symbolFrom: Nothing,
    symbolTo: Nothing,
  };

  const lim = Nothing;

  if (swapType === SwapType.DOUBLE_SWAP) {
    let X = tokenAmount(10000); // Input asset
    let Y = tokenAmount(10); // Output asset
    let R = tokenAmount(10000);
    let Z = tokenAmount(10);
    const Py = runePrice;

    // CHANGELOG:
    /*
      balance_rune => runeDepth
      balance_token => assetDepth
    */
    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const runeDepth = baseAmount(poolData?.runeDepth ?? 0);
      const assetDepth = baseAmount(poolData?.assetDepth ?? 0);
      const { symbol = '' } = getAssetFromString(poolData?.asset);

      const token = getTickerFormat(symbol);
      if (token.toLowerCase() === from.toLowerCase()) {
        // formula: assetDepth / BASE_NUMBER
        X = baseToToken(assetDepth);
        // formula: runeDepth / BASE_NUMBER
        Y = baseToToken(runeDepth);
        result.poolAddressFrom = poolAddress;
        result.symbolFrom = symbol;
      }

      if (token.toLowerCase() === to.toLowerCase()) {
        // formula: runeDepth / BASE_NUMBER
        R = baseToToken(runeDepth);
        // formula: assetDepth / BASE_NUMBER
        Z = baseToToken(assetDepth);
        result.poolAddressTo = poolAddress;
        result.symbolTo = symbol;
      }
    });

    const calcData: DoubleSwapCalcData = { X, Y, R, Z, Py, Pr: Py };

    const zValue = getZValue(xValue, calcData);
    const slip = getSlip(xValue, calcData);
    const Px = getPx(xValue, calcData);
    const Pz = getPz(xValue, calcData);
    const fee = getFee(xValue, calcData);

    return {
      ...result,
      Px,
      slip,
      outputAmount: zValue,
      outputPrice: Pz,
      fee,
      lim,
    };
  }

  if (swapType === SwapType.SINGLE_SWAP && to.toLowerCase() === 'rune') {
    let X = tokenAmount(10);
    let Y = tokenAmount(10);
    const Py = runePrice;
    const rune = 'RUNE-A1F';

    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const runeDepth = baseAmount(poolData?.runeDepth ?? 0);
      const assetDepth = baseAmount(poolData?.assetDepth ?? 0);
      const { symbol = '' } = getAssetFromString(poolData?.asset);

      const token = getTickerFormat(symbol);
      if (token.toLowerCase() === from.toLowerCase()) {
        // formula: assetDepth / BASE_NUMBER
        X = baseToToken(assetDepth);
        // formula: runeDepth / BASE_NUMBER
        Y = baseToToken(runeDepth);

        result.poolAddressTo = poolAddress;
        result.symbolFrom = symbol;
      }
    });

    result.symbolTo = rune;
    const calcData: SingleSwapCalcData = { X, Y, Py };

    const Px = getPx(xValue, calcData);
    // formula: (xValue + X) ** 2
    const times = X.amount()
      .plus(xValue.amount())
      .pow(2);
    const xTimes = xValue.amount().pow(2);
    // formula: X ** 2
    const balanceTimes = X.amount().pow(2);
    // formula: (xValue * X * Y) / times
    const outputTokenBN = X.amount()
      .multipliedBy(Y.amount())
      .multipliedBy(xValue.amount())
      .div(times);
    // formula: (Px * (X + xValue)) / (Y - outputToken)
    const a = X.amount()
      .plus(xValue.amount())
      .multipliedBy(Px);
    const b = Y.amount().minus(outputTokenBN);
    const outputPy = a.div(b);

    // calc trade slip
    // formula: ((xValue * (2 * X + xValue)) / balanceTimes) * 100
    const slipValue = X.amount()
      .multipliedBy(2)
      .plus(xValue.amount())
      .multipliedBy(xValue.amount())
      .div(balanceTimes)
      .multipliedBy(100);
    const slip = bn(slipValue);
    // formula: (1 - 3 / 100) * outputToken * BASE_NUMBER
    const limValue = bn(1)
      .minus(3 / 100)
      .multipliedBy(outputTokenBN);
    const lim = tokenToBase(tokenAmount(limValue));
    // formula: (xTimes * Y) / times
    const feeValue = Y.amount()
      .multipliedBy(xTimes)
      .div(times);
    const fee = tokenAmount(feeValue);

    return {
      ...result,
      Px,
      slip,
      outputAmount: tokenAmount(outputTokenBN),
      outputPrice: outputPy,
      lim,
      fee,
    };
  }

  if (swapType === SwapType.SINGLE_SWAP && from.toLowerCase() === 'rune') {
    let X = tokenAmount(10000);
    let Y = tokenAmount(10);
    const Px = bn(runePrice);
    const rune = 'RUNE-A1F';

    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const runeDepth = baseAmount(poolData?.runeDepth ?? 0);
      const assetDepth = baseAmount(poolData?.assetDepth ?? 0);
      const { symbol = '' } = getAssetFromString(poolData?.asset);

      const ticker = getTickerFormat(symbol);
      if (ticker.toLowerCase() === to.toLowerCase()) {
        X = baseToToken(runeDepth);
        Y = baseToToken(assetDepth);

        result.poolAddressTo = poolAddress;
        result.symbolTo = symbol;
      }
    });

    // Set RUNE for fromToken as we don't have rune in the pool from thorchain
    result.symbolFrom = rune;

    const times = X.amount()
      .plus(xValue.amount())
      .pow(2);
    const xTimes = xValue.amount().pow(2);
    const balanceTimes = X.amount().pow(2);
    const outputTokenBN = X.amount()
      .multipliedBy(Y.amount())
      .multipliedBy(xValue.amount())
      .div(times);
    const a = X.amount()
      .plus(xValue.amount())
      .multipliedBy(Px);
    const b = Y.amount().minus(outputTokenBN);
    const outputPy = a.div(b);

    // trade slip
    // avoid division by zero
    const slip = balanceTimes.gt(0)
      ? X.amount()
          .multipliedBy(2)
          .plus(xValue.amount())
          .multipliedBy(xValue.amount())
          .div(balanceTimes)
          .multipliedBy(100)
      : bn(0);

    // formula: (1 - 3 / 100) * outputToken * BASE_NUMBER;
    const third = bn(3).div(bn(100));
    const limValue = bn(1)
      .minus(third)
      .div(100)
      .multipliedBy(outputTokenBN);
    const lim = tokenToBase(tokenAmount(limValue));
    const feeValue = Y.amount()
      .multipliedBy(xTimes)
      .div(times);
    const fee = tokenAmount(feeValue);
    return {
      ...result,
      Px,
      slip,
      outputAmount: tokenAmount(outputTokenBN),
      outputPrice: outputPy,
      lim,
      fee,
    };
  }

  return Nothing;
};

export enum SwapErrorMsg {
  INVALID_AMOUNT = 'Amount to swap is invalid.',
  MISSING_WALLET = 'Wallet address is missing or invalid.',
  MISSING_SYMBOL = 'Symbol is missing.',
  MISSING_SYMBOL_TO = 'Symbol to swap to is missing.',
  MISSING_SYMBOL_FROM = 'Symbol to swap from is missing.',
  MISSING_ADDRESS_TO = 'Address to swap to is missing.',
  MISSING_ADDRESS_FROM = 'Address to swap from is missing.',
  MISSING_POOL_ADDRESS = 'Pool address is missing.',
}

export const validateSwap = (
  wallet: string,
  swapType: SwapType,
  data: Partial<CalcResult>,
  amount: TokenAmount,
): Maybe<SwapErrorMsg> => {
  if (!wallet) {
    return SwapErrorMsg.MISSING_WALLET;
  }
  const amountValue = amount.amount();
  // amount can't be NaN or an INFITIY number
  // The latter check is needed for Binance API, which accepts numbers only
  const validAmount =
    isValidBN(amountValue) &&
    amountValue.isGreaterThan(0) &&
    amountValue.isFinite();
  // validate values - needed for single swap and double swap
  if (!validAmount) {
    return SwapErrorMsg.INVALID_AMOUNT;
  }
  const symbolTo = data?.symbolTo;
  if (!symbolTo) {
    return SwapErrorMsg.MISSING_SYMBOL_TO;
  }
  const poolAddressTo = data?.poolAddressTo;
  if (!poolAddressTo) {
    return SwapErrorMsg.MISSING_ADDRESS_TO;
  }

  // validate values - needed for double swap only
  if (swapType === SwapType.DOUBLE_SWAP) {
    const poolAddressFrom = data?.poolAddressFrom;
    if (!poolAddressFrom) {
      return SwapErrorMsg.MISSING_ADDRESS_FROM;
    }
    const symbolFrom = data?.symbolFrom;
    if (!symbolFrom) {
      return SwapErrorMsg.MISSING_SYMBOL_FROM;
    }
  }
  return Nothing;
};

// TODO(Veado): Write tests for `confirmSwap'
export const confirmSwap = (
  Binance: BinanceClient,
  wallet: string,
  from: string,
  to: string,
  data: CalcResult,
  amount: TokenAmount,
  protectSlip: boolean,
  destAddr = '',
): Promise<TransferResult> => {
  return new Promise((resolve, reject) => {
    const swapType = getSwapType(from, to);

    const validationErrorMsg = validateSwap(wallet, swapType, data, amount);
    if (validationErrorMsg) {
      return reject(new Error(validationErrorMsg));
    }

    const { poolAddressTo, symbolTo, symbolFrom, lim } = data;

    if (!poolAddressTo) {
      return reject(new Error(SwapErrorMsg.MISSING_POOL_ADDRESS));
    }

    if (!symbolFrom) {
      return reject(new Error(SwapErrorMsg.MISSING_SYMBOL));
    }

    // Check of `validateSwap` before makes sure that we have a valid number here
    const amountNumber = amount.amount().toNumber();

    const limit = protectSlip && lim ? lim.amount().toString() : '';
    const memo = getSwapMemo(symbolTo, destAddr, limit);

    Binance.transfer(wallet, poolAddressTo, amountNumber, symbolFrom, memo)
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

export const getTxResult = ({
  pair,
  tx,
  address,
}: {
  pair: Pair;
  tx: TransferEvent;
  address?: string;
}) => {
  const { txToken, txAmount, txTo } = parseTransfer(tx);
  const { source, target } = pair;

  const IS_IN_TX = address && txTo === address;
  const IS_REFUND = IS_IN_TX && getTickerFormat(txToken) === source;
  const IS_OUTBOUND = IS_IN_TX && getTickerFormat(txToken) === target;

  if (IS_REFUND) {
    return {
      type: 'refund',
      amount: txAmount,
      token: txToken,
    };
  }

  if (IS_OUTBOUND) {
    return {
      type: 'success',
      amount: txAmount,
      token: txToken,
    };
  }

  return null;
};
