import { getSwapMemo } from '../../helpers/memoHelper';
import { getTickerFormat, getFixedNumber } from '../../helpers/stringHelper';
import { getZValue, getPx, getPz, getSlip, getFee } from './calc';
import { BASE_NUMBER } from '../../settings/constants';

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
        X = Number(assetStakedTotal);
        Y = Number(runeStakedTotal);
        result.poolAddressFrom = poolAddress;
        result.symbolFrom = symbol;
      }

      if (token.toLowerCase() === to.toLowerCase()) {
        R = Number(runeStakedTotal);
        Z = Number(assetStakedTotal);
        result.poolAddressTo = poolAddress;
        result.symbolTo = symbol;
      }
    });
    result.ratio = (Y / X / Z) * R;

    const calcData = { X, Y, R, Z, Py, Pr: Py };

    const zValue = getZValue(xValue, calcData).toFixed(2);
    const slip = getFixedNumber(getSlip(xValue, calcData), 0);
    const Px = getPx(xValue, calcData);
    const Pz = getPz(xValue, calcData).toFixed(2);
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
        X = Number(assetStakedTotal);
        Y = Number(runeStakedTotal);
        result.ratio = X / Y;

        result.poolAddressTo = poolAddress;
        result.symbolFrom = symbol;
      }
    });

    result.symbolTo = rune;
    const calcData = { X, Y, Py };

    const Px = getPx(xValue, calcData);
    const times = (xValue + X) ** 2;
    const xTimes = xValue ** 2;
    const outputToken = Number(((xValue * X * Y) / times).toFixed(2));
    const outputPy = ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2);
    const input = xValue * Px;
    const output = outputToken * outputPy;
    const slip = input !== 0 ? Math.round(((input - output) / input) * 100) : 0;
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
        X = Number(runeStakedTotal);
        Y = Number(assetStakedTotal);
        result.ratio = X / Y;

        result.poolAddressTo = poolAddress;
        result.symbolTo = symbol;
      }
    });

    // Set RUNE for fromToken as we don't have rune in the pool from thorchain
    result.symbolFrom = rune;

    const times = (xValue + X) ** 2;
    const xTimes = xValue ** 2;
    const outputToken = Number(((xValue * X * Y) / times).toFixed(2));
    const outputPy = ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2);
    const input = xValue * Px;
    const output = outputToken * outputPy;
    const slip = input !== 0 ? Math.round(((input - output) / input) * 100) : 0;
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
    console.log('confirm swap', type, wallet, from, to, data, amount, destAddr);

    if (!validateSwap(wallet, type, data, amount)) {
      return reject();
    }

    const { poolAddressTo, symbolTo, symbolFrom } = data;

    // TODO: ignored limit
    // const limit = protectSlip ? lim : '';
    const limit = '';
    const memo = getSwapMemo(symbolTo, destAddr, limit);
    console.log('memo: ', memo);
    Binance.transfer(wallet, poolAddressTo, amount, symbolFrom, memo)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

export const parseTransfer = tx => {
  const txHash = tx.data.H;
  const txMemo = tx.data.M;
  const txFrom = tx.data.f;
  const txTo = tx.data.t[0].o;
  const txAmount = tx.data.t[0].c[0].A;
  const txToken = tx.data.t[0].c[0].a;

  return {
    txHash,
    txMemo,
    txFrom,
    txTo,
    txToken,
    txAmount,
  };
};

export const isOutboundTx = tx => {
  if (tx.data.M) {
    return tx.data.M.includes('OUTBOUND');
  }
  return false;
};

export const getTxResult = (tx, fromAddr, toAddr, fromToken, toToken) => {
  if (isOutboundTx(tx)) {
    const { txFrom, txTo, txToken, txAmount } = parseTransfer(tx);

    if (txFrom === toAddr && txTo === fromAddr) {
      if (txToken === fromToken) {
        return {
          type: 'refund',
          amount: txAmount,
          token: txToken,
        };
      }
      if (txToken === toToken) {
        return {
          type: 'success',
          amount: txAmount,
          token: txToken,
        };
      }
    }
  }
  return null;
};
