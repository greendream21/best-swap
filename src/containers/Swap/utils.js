import { getSwapMemo } from '../../helpers/memoHelper';
import { getTickerFormat, getFixedNumber } from '../../helpers/stringHelper';
import { getZValue, getPx, getPz, getSlip, getFee } from './calc';
import { BASE_NUMBER } from '../../settings/constants';
import { getTxHashFromMemo } from '../../helpers/binance';

export const getSwapType = (from, to) => {
  if (from.toLowerCase() === 'rune' || to.toLowerCase() === 'rune') {
    return 'single_swap';
  }
  return 'double_swap';
};

export const getCalcResult = (
  from,
  to,
  pools,
  poolAddress,
  xValue,
  runePrice,
) => {
  const type = getSwapType(from, to);

  if (type === 'double_swap') {
    let X = 10000;
    let Y = 10;
    let R = 10000;
    let Z = 10;
    const Py = runePrice;
    const result = {};

    // CHANGELOG:
    /*
      balance_rune => runeStakedTotal
      balance_token => assetStakedTotal
    */
    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const {
        runeStakedTotal,
        assetStakedTotal,
        asset: { symbol },
      } = poolData;

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

    const result = {};

    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const {
        runeStakedTotal,
        assetStakedTotal,
        asset: { symbol },
      } = poolData;

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

    const result = {};

    Object.keys(pools).forEach(key => {
      const poolData = pools[key];
      const {
        runeStakedTotal,
        assetStakedTotal,
        asset: { symbol },
      } = poolData;

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

  return null;
};

export const validateSwap = (wallet, type, data, amount) => {
  if (type === 'single_swap') {
    const { symbolTo } = data;
    if (!wallet || !symbolTo || !amount) {
      return false;
    }
  }
  if (type === 'double_swap') {
    const { poolAddressFrom, symbolFrom, poolAddressTo, symbolTo } = data;
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
  Binance,
  wallet,
  from,
  to,
  data,
  amount,
  protectSlip,
  destAddr = '',
) => {
  return new Promise((resolve, reject) => {
    const type = getSwapType(from, to);

    if (!validateSwap(wallet, type, data, amount)) {
      return reject();
    }

    const { poolAddressTo, symbolTo, symbolFrom, lim } = data;

    const limit = protectSlip ? lim : '';
    const memo = getSwapMemo(symbolTo, destAddr, limit);
    Binance.transfer(wallet, poolAddressTo, amount, symbolFrom, memo)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

export const parseTransfer = tx => {
  const data = tx?.data ?? {};
  const txHash = data?.H;
  const txMemo = data?.M;
  const txFrom = data?.f;
  const t = data?.t ?? [];
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

export const isOutboundTx = tx =>
  tx?.data?.M?.toUpperCase().includes('OUTBOUND') ?? false;

export const isRefundTx = tx =>
  tx?.data?.M?.toUpperCase().includes('REFUND') ?? false;

export const getTxResult = ({ tx, hash }) => {
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
