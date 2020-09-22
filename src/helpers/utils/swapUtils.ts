import BigNumber from 'bignumber.js';
import { TransferResult, WS } from '@thorchain/asgardex-binance';
import {
  bn,
  isValidBN,
  getDoubleSwapSlip,
  baseAmount as getBaseAmount,
  PoolData,
} from '@thorchain/asgardex-util';
import {
  TokenAmount,
  BaseAmount,
  tokenAmount,
  baseToToken,
  baseAmount,
  tokenToBase,
} from '@thorchain/asgardex-token';

import { getSwapMemo } from '../memoHelper';
import {
  getZValue,
  getPx,
  getPz,
  getFee,
  SingleSwapCalcData,
  DoubleSwapCalcData,
} from '../calculations';
import { PoolDataMap } from '../../redux/midgard/types';
import { getAssetFromString } from '../../redux/midgard/utils';
import { PoolDetail } from '../../types/generated/midgard/api';
import {
  FixmeType,
  Nothing,
  Maybe,
  SwapType,
  Pair,
  AssetPair,
} from '../../types/bepswap';
import { SwapData } from './types';

import { RUNE_SYMBOL } from '../../settings/assetData';

/**
 * return all valid swap pairs
 * @param sourceInfo assets in the balance
 * @param targetInfo assets in the pool
 * @param sourceSymbol source symbol for swap
 * @param targetSymbol target symbol for swap
 */
export const getValidSwapPairs = (
  sourceInfo: AssetPair[],
  targetInfo: AssetPair[],
  sourceSymbol: string,
  targetSymbol: string,
) => {
  const poolAssets = targetInfo.map(
    data => getAssetFromString(data.asset).symbol,
  );
  const sourceData = sourceInfo.filter((data: AssetPair) => {
    const symbol = getAssetFromString(data.asset).symbol;
    return symbol !== sourceSymbol && poolAssets.includes(symbol);
  });
  const targetData = targetInfo.filter(
    (data: AssetPair) => getAssetFromString(data.asset).symbol !== targetSymbol,
  );
  return {
    sourceData,
    targetData,
  };
};

/**
 * return if swap is valid or not
 * @param pools array of pool asset symbols
 * @param sourceSymbol source symbol for swap
 * @param targetSymbol target symbol for swap
 */
export const isValidSwap = (
  pools: string[],
  sourceSymbol: string,
  targetSymbol: string,
) => {
  const availableAssets = pools.map(
    chainString => getAssetFromString(chainString).symbol,
  );
  availableAssets.push(RUNE_SYMBOL);

  if (sourceSymbol === targetSymbol || !targetSymbol || !sourceSymbol) {
    return false;
  }
  if (
    !availableAssets.includes(sourceSymbol) ||
    !availableAssets.includes(targetSymbol)
  ) {
    return false;
  }

  return true;
};

/**
 * return the swap type - SINGLE | DOUBLE
 * @param source source asset symbol
 * @param target target asset symbol
 */
export const getSwapType = (source: string, target: string) =>
  source === RUNE_SYMBOL || target === RUNE_SYMBOL
    ? SwapType.SINGLE_SWAP
    : SwapType.DOUBLE_SWAP;

// TODO: fix hard coded slip limit
// TODO: refactor getswapdata
/**
 * Return Calculations for swap tx
 * @param from Asset symbol for source
 * @param to Asset symbol for target
 * @param pools Pool detail data
 * @param xValue Input amount
 * @param runePrice RUNE Price
 */
export const getSwapData = (
  symbolFrom: string,
  symbolTo: string,
  pools: PoolDataMap,
  xValue: TokenAmount,
  runePrice: BigNumber,
): Maybe<SwapData> => {
  const swapType = getSwapType(symbolFrom, symbolTo);

  const result: {
    symbolFrom: string;
    symbolTo: string;
  } = {
    symbolFrom,
    symbolTo,
  };

  if (swapType === SwapType.DOUBLE_SWAP) {
    const Py = runePrice;

    // pool for source asset
    const sourcePool: PoolDetail = pools[symbolFrom];

    const sourceRuneDepth = baseAmount(sourcePool?.runeDepth ?? 0);
    const sourceAssetDepth = baseAmount(sourcePool?.assetDepth ?? 0);
    // formula: assetDepth / BASE_NUMBER
    const X = baseToToken(sourceAssetDepth);
    // formula: runeDepth / BASE_NUMBER
    const Y = baseToToken(sourceRuneDepth);

    // pool for target asset
    const targetPool: PoolDetail = pools[symbolTo];

    const targetRuneDepth = baseAmount(targetPool?.runeDepth ?? 0);
    const targetAssetDepth = baseAmount(targetPool?.assetDepth ?? 0);
    // formula: runeDepth / BASE_NUMBER
    const R = baseToToken(targetRuneDepth);
    // formula: assetDepth / BASE_NUMBER
    const Z = baseToToken(targetAssetDepth);

    const calcData: DoubleSwapCalcData = { X, Y, R, Z, Py, Pr: Py };

    const zValue = getZValue(xValue, calcData);

    // TODO: remove getBaseAmount once asgardex-util is fixed
    const inputBaseAmount = tokenToBase(xValue);
    const inputBaseAmountValue = getBaseAmount(inputBaseAmount.amount(), 8);
    const sourcePoolData: PoolData = {
      assetBalance: getBaseAmount(sourcePool?.assetDepth ?? 0, 8),
      runeBalance: getBaseAmount(sourcePool?.runeDepth ?? 0, 8),
    };
    const targetPoolData: PoolData = {
      assetBalance: getBaseAmount(targetPool?.assetDepth ?? 0, 8),
      runeBalance: getBaseAmount(targetPool?.runeDepth ?? 0, 8),
    };

    const slip = getDoubleSwapSlip(
      inputBaseAmountValue,
      sourcePoolData,
      targetPoolData,
    );
    const Px = getPx(xValue, calcData);
    const Pz = getPz(xValue, calcData);
    const fee = getFee(xValue, calcData);

    const limitValue = zValue.amount().multipliedBy(70 / 100);
    const slipLimit = tokenToBase(tokenAmount(limitValue));

    return {
      ...result,
      Px,
      slip,
      outputAmount: zValue,
      outputPrice: Pz,
      fee,
      slipLimit,
    };
  }

  if (swapType === SwapType.SINGLE_SWAP && symbolTo === RUNE_SYMBOL) {
    const Py = runePrice;

    const poolData: PoolDetail = pools[symbolFrom];
    const runeDepth = baseAmount(poolData?.runeDepth ?? 0);
    const assetDepth = baseAmount(poolData?.assetDepth ?? 0);

    // formula: assetDepth / BASE_NUMBER
    const X = baseToToken(assetDepth);
    // formula: runeDepth / BASE_NUMBER
    const Y = baseToToken(runeDepth);

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
    // formula: (1 - 30 / 100) * outputToken * BASE_NUMBER
    const limitValue = outputTokenBN.multipliedBy(70 / 100);
    const slipLimit = tokenToBase(tokenAmount(limitValue));
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
      slipLimit,
      fee,
    };
  }

  if (swapType === SwapType.SINGLE_SWAP && symbolFrom === RUNE_SYMBOL) {
    const Px = bn(runePrice);

    const poolData = pools[symbolTo];
    const runeDepth = baseAmount(poolData?.runeDepth ?? 0);
    const assetDepth = baseAmount(poolData?.assetDepth ?? 0);
    const X = baseToToken(runeDepth);
    const Y = baseToToken(assetDepth);

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

    // formula: (1 - 30 / 100) * outputToken * BASE_NUMBER;
    const limitValue = outputTokenBN.multipliedBy(70 / 100);
    const slipLimit = tokenToBase(tokenAmount(limitValue));
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
      slipLimit,
      fee,
    };
  }

  return Nothing;
};

export enum SwapErrorMsg {
  INVALID_AMOUNT = 'Swap amount is invalid.',
  MISSING_WALLET = 'Wallet address is missing or invalid.',
}

export const validateSwap = (
  wallet: string,
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
  return Nothing;
};

// TODO(Veado): Write tests for `confirmSwap'
export const confirmSwap = (
  bncClient: FixmeType,
  wallet: string,
  symbolFrom: string,
  symbolTo: string,
  amount: TokenAmount,
  protectSlip: boolean,
  slipLimit: BaseAmount,
  poolAddress: string,
  destAddr = '',
): Promise<TransferResult> => {
  return new Promise((resolve, reject) => {
    const validationErrorMsg = validateSwap(wallet, amount);
    if (validationErrorMsg) {
      return reject(new Error(validationErrorMsg));
    }

    // Check of `validateSwap` before makes sure that we have a valid number here
    const amountNumber = amount.amount().toNumber();

    const limit = protectSlip && slipLimit ? slipLimit.amount().toString() : '';
    const memo = getSwapMemo(symbolTo, destAddr, limit);

    bncClient
      .transfer(wallet, poolAddress, amountNumber, symbolFrom, memo)
      .then((response: TransferResult) => resolve(response))
      .catch((error: Error) => reject(error));
  });
};

export const parseTransfer = (tx?: Pick<WS.TransferEvent, 'data'>) => {
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
  tx: WS.TransferEvent;
  address?: string;
}) => {
  const { txToken, txAmount, txTo } = parseTransfer(tx);
  const { source, target } = pair;

  const IS_IN_TX = address && txTo === address;
  const IS_REFUND = IS_IN_TX && txToken.toLowerCase() === source?.toLowerCase();
  const IS_OUTBOUND =
    IS_IN_TX && txToken.toLowerCase() === target?.toLowerCase();

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
