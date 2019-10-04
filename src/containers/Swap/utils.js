import { getSwapMemo } from '../../helpers/memoHelper';
import { getZValue, getPx, getPz, getSlip } from './calc';

const BASE_NUMBER = 10 ** 8;

export const getSwapType = (from, to) => {
  if (from.toLowerCase() === 'rune' || to.toLowerCase() === 'rune') {
    return 'single_swap';
  }
  return 'double_swap';
};

export const getCalcResult = (from, to, pools, xValue, runePrice) => {
  const type = getSwapType(from, to);

  if (type === 'double_swap') {
    let X = 10000;
    let Y = 10;
    let R = 10000;
    let Z = 10;
    const Py = runePrice;
    const result = {};

    pools.forEach(poolData => {
      const { balance_rune, balance_token, pool_address, symbol } = poolData;

      const token = symbol.split('-')[0];
      if (token.toLowerCase() === from.toLowerCase()) {
        X = Number(balance_token);
        Y = Number(balance_rune);
        result.poolAddressFrom = pool_address;
        result.symbolFrom = symbol;
      }

      if (token.toLowerCase() === to.toLowerCase()) {
        R = Number(balance_rune);
        Z = Number(balance_token);
        result.poolAddressTo = pool_address;
        result.symbolTo = symbol;
      }
    });

    const calcData = { X, Y, R, Z, Py, Pr: Py };

    const zValue = getZValue(xValue, calcData).toFixed(2);
    const slip = getSlip(xValue, calcData);
    const Px = getPx(xValue, calcData);
    const Pz = getPz(xValue, calcData).toFixed(2);

    return {
      ...result,
      Px,
      slip,
      outputAmount: zValue,
      outputPrice: Pz,
    };
  }

  if (type === 'single_swap' && to.toLowerCase() === 'rune') {
    let X = 10;
    let Y = 10;
    const Py = runePrice;
    const rune = 'RUNE-A1F';

    const result = {};

    pools.forEach(poolData => {
      const { balance_rune, balance_token, pool_address, symbol } = poolData;

      const token = symbol.split('-')[0];
      if (token.toLowerCase() === from.toLowerCase()) {
        X = Number(balance_token);
        Y = Number(balance_rune);
        result.poolAddressTo = pool_address;
        result.symbolFrom = symbol;
      }
    });

    result.symbolTo = rune;
    const calcData = { X, Y, Py };

    const Px = getPx(xValue, calcData);
    const times = (xValue + X) ** 2;
    const outputToken = Number(((xValue * X * Y) / times).toFixed(2));
    const outputPy = ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2);
    const input = xValue * Px;
    const output = outputToken * outputPy;
    const slip = input !== 0 ? Math.round(((input - output) / input) * 100) : 0;
    const lim = Math.round((1 - 3 / 100) * outputToken * BASE_NUMBER);

    return {
      ...result,
      Px,
      slip,
      outputAmount: outputToken,
      outputPrice: outputPy,
      lim,
    };
  }

  if (type === 'single_swap' && from.toLowerCase() === 'rune') {
    let X = 10000;
    let Y = 10;
    const Px = runePrice;
    const rune = 'RUNE-A1F';

    const result = {};

    pools.forEach(poolData => {
      const { balance_rune, balance_token, pool_address, symbol } = poolData;

      const token = symbol.split('-')[0];
      if (token.toLowerCase() === to.toLowerCase()) {
        X = Number(balance_rune);
        Y = Number(balance_token);
        result.poolAddressTo = pool_address;
        result.symbolTo = symbol;
      }
    });

    // Set RUNE for fromToken as we don't have rune in the pool from statechain
    result.symbolFrom = rune;

    const times = (xValue + X) ** 2;
    const outputToken = Number(((xValue * X * Y) / times).toFixed(2));
    const outputPy = ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2);
    const input = xValue * Px;
    const output = outputToken * outputPy;
    const slip = input !== 0 ? Math.round(((input - output) / input) * 100) : 0;
    const lim = Math.round((1 - 3 / 100) * outputToken * BASE_NUMBER);

    return {
      ...result,
      Px,
      slip,
      outputAmount: outputToken,
      outputPrice: outputPy,
      lim,
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

    const { poolAddressTo, symbolTo, symbolFrom, lim } = data;

    const limit = protectSlip ? lim : '';
    const memo = getSwapMemo(symbolTo, destAddr, limit);
    console.log('memo: ', memo);
    Binance.transfer(wallet, poolAddressTo, amount, symbolFrom, memo)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};
