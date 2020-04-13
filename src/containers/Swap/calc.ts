import BigNumber from 'bignumber.js';
import { TokenAmount } from '../../types/token';
import { tokenAmount } from '../../helpers/tokenHelper';
import { Maybe } from '../../types/bepswap';

export type DoubleSwapCalcData = {
  X: TokenAmount;
  Y: TokenAmount;
  R: TokenAmount;
  Z: TokenAmount;
  Py: BigNumber; // price
  Pr: BigNumber; // price
};

export type SingleSwapCalcData = Pick<DoubleSwapCalcData, 'X' | 'Y' | 'Py'>;

/**
 * Formula helper to get `YValue`
 */
export const getYValue = (
  xValue: TokenAmount,
  data: Required<{ X: TokenAmount; Y: TokenAmount }>,
): TokenAmount => {
  const { X, Y } = data;
  // formula: (xValue + X) ** 2
  const times = X.amount()
    .plus(xValue.amount())
    .pow(2);
  // formula: (xValue * X * Y) / times
  const yValue = X.amount()
    .multipliedBy(Y.amount())
    .multipliedBy(xValue.amount())
    .div(times);

  return tokenAmount(yValue);
};

/**
 * Formula helper to calulculate value for output
 */
export const getZValue = (
  xValue: TokenAmount,
  data: Required<{
    R: TokenAmount;
    X: TokenAmount;
    Y: TokenAmount;
    Z: TokenAmount;
  }>,
): TokenAmount => {
  const { R, Z } = data;
  const yValue = getYValue(xValue, data).amount();
  // formula: (yValue + R) ** 2
  const times = yValue.plus(R.amount()).pow(2);
  // formula: (yValue * R * Z) / times
  const result = yValue
    .multipliedBy(R.amount())
    .multipliedBy(Z.amount())
    .div(times);
  return tokenAmount(result);
};

/**
 * Formula helper to calulculate fee value
 */
export const getFee = (
  xValue: TokenAmount,
  data: Required<{
    R: TokenAmount;
    X: TokenAmount;
    Y: TokenAmount;
    Z: TokenAmount;
  }>,
): TokenAmount => {
  const { R, Z } = data;
  const yValue = getYValue(xValue, data).amount();
  // formula: (yValue + R) ** 2
  const times = yValue.plus(R.amount()).pow(2);
  // formula: yValue ** 2
  const yTimes = yValue.pow(2);
  // formula: (yTimes * Z) / times
  const result = yTimes.multipliedBy(Z.amount()).div(times);
  return tokenAmount(result);
};

/**
 * Formula helper to calculate value of `Px`
 */
export const getPx = (
  xValue: Maybe<TokenAmount>,
  data: Required<{ X: TokenAmount; Y: TokenAmount; Py: BigNumber }>,
): BigNumber => {
  const { X, Y, Py } = data;

  let result: BigNumber;
  if (xValue) {
    const yValue = getYValue(xValue, data).amount();
    // formula: (Py * (Y - yValue)) / (X + xValue)
    const a = Y.amount().minus(yValue);
    const b = X.amount().plus(xValue.amount());
    result = Py.multipliedBy(a).div(b);
  } else {
    // formula: (Py * Y) / X
    result = Py.multipliedBy(Y.amount()).div(X.amount());
  }
  return result;
};

/**
 * Formula helper to calulculate price value
 */
export const getPz = (
  xValue: Maybe<TokenAmount>,
  data: Required<{
    X: TokenAmount;
    Y: TokenAmount;
    Z: TokenAmount;
    R: TokenAmount;
    Pr: BigNumber;
  }>,
): BigNumber => {
  const { Z, R, Pr } = data;

  let result: BigNumber;
  if (xValue) {
    const zValue = getZValue(xValue, data).amount();
    const yValue = getYValue(xValue, data).amount();
    // formula: (Pr * (R + yValue)) / (Z - zValue)
    const a = R.amount().plus(yValue);
    const b = Z.amount().minus(zValue);
    result = Pr.multipliedBy(a).div(b);
  } else {
    // formula: (Pr * R) / Z;
    result = Pr.multipliedBy(R.amount()).div(Z.amount());
  }
  return result;
};

/**
 * Formula helper to calulculate slip value
 */
export const getSlip = (
  xValue: TokenAmount,
  data: Required<{ X: TokenAmount; Y: TokenAmount; R: TokenAmount }>,
): BigNumber => {
  const { R } = data;
  const yValue = getYValue(xValue, data).amount();
  // formula: (yValue + R) ** 2
  const times: BigNumber = yValue.plus(R.amount()).pow(2);
  // formula: ((yValue * (2 * R + yValue)) / times) * 100
  const a = R.amount()
    .multipliedBy(2)
    .plus(yValue);
  const slip = yValue
    .multipliedBy(a)
    .div(times)
    .multipliedBy(100);
  return slip;
};
