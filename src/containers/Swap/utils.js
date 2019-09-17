import { getSwapMemo } from '../../helpers/memoHelper';
import { getZValue, getPx, getPz, getSlip } from './calc';

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
    let result = {};

    pools.forEach(poolData => {
      const { balance_rune, balance_token, pool_address, ticker } = poolData;

      const token = ticker.split('-')[0];
      if (token.toLowerCase() === from.toLowerCase()) {
        X = Number(balance_token);
        Y = Number(balance_rune);
        result.poolAddressFrom = pool_address;
        result.tickerFrom = ticker;
      }

      if (token.toLowerCase() === to.toLowerCase()) {
        R = Number(balance_rune);
        Z = Number(balance_token);
        result.poolAddressTo = pool_address;
        result.tickerTo = ticker;
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

  if (type === 'single_swap') {
    let X = 10000;
    let Y = 10;
    const Px = runePrice;
    let result = {};

    pools.forEach(poolData => {
      const { balance_rune, balance_token, pool_address, ticker } = poolData;

      const token = ticker.split('-')[0];
      if (token.toLowerCase() === to.toLowerCase()) {
        X = Number(balance_rune);
        Y = Number(balance_token);
        result.poolAddressTo = pool_address;
        result.tickerTo = ticker;
      }
    });

    // Set RUNE for fromToken as we don't have rune in the pool from statechain
    const rune = 'RUNE-A1F';
    result.tickerFrom = rune;

    const times = (xValue + X) ** 2;
    const outputToken = Number(((xValue * X * Y) / times).toFixed(2));
    const outputPy = ((Px * (X + xValue)) / (Y - outputToken)).toFixed(2);
    const input = xValue * Px;
    const output = outputToken * outputPy;
    const slip = input !== 0 ? Math.round(((input - output) / input) * 100) : 0;

    return {
      ...result,
      Px,
      slip,
      outputAmount: outputToken,
      outputPrice: outputPy,
    };
  }
};

export const validateSwap = (wallet, type, data, amount) => {
  if (type === 'single_swap') {
    const { poolAddressTo, tickerTo } = data;
    if (!wallet || !poolAddressTo || !tickerTo || !amount) {
      return false;
    }
  }
  if (type === 'double_swap') {
    const { poolAddressFrom, tickerFrom, poolAddressTo, tickerTo } = data;
    if (
      !wallet ||
      !poolAddressFrom ||
      !tickerFrom ||
      !poolAddressTo ||
      !tickerTo ||
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
  destAddr = '',
) => {
  return new Promise((resolve, reject) => {
    const type = getSwapType(from, to);
    console.log('confirm swap', type, wallet, from, to, data, amount, destAddr);

    if (!validateSwap(wallet, type, data, amount)) {
      return reject();
    }

    const { poolAddressTo, tickerTo, tickerFrom } = data;

    const memo = getSwapMemo(tickerTo, destAddr);
    console.log('memo: ', memo);
    Binance.transfer(wallet, poolAddressTo, amount, tickerFrom, memo)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
  // console.log('memo: ', memo);

  // Stake action
  // const fromAmount = Number(amount).toFixed(2);
  // const toAmount = Number(outputAmount).toFixed(2);

  // let outputs;
  // if (poolAddressFrom !== poolAddressTo) {
  //   outputs = [
  //     {
  //       to: poolAddressFrom,
  //       coins: [
  //         {
  //           denom: tickerFrom,
  //           amount: fromAmount,
  //         },
  //       ],
  //     },
  //     {
  //       to: poolAddressTo,
  //       coins: [
  //         {
  //           denom: tickerTo,
  //           amount: toAmount,
  //         },
  //       ],
  //     },
  //   ];
  // } else {
  //   outputs = [
  //     {
  //       to: poolAddressFrom,
  //       coins: [
  //         {
  //           denom: tickerFrom,
  //           amount: fromAmount,
  //         },
  //         {
  //           denom: tickerTo,
  //           amount: toAmount,
  //         },
  //       ],
  //     },
  //   ];
  // }

  // Binance.multiSend(wallet, outputs, memo);
};
