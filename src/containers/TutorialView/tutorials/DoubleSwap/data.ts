import { bn } from '@thorchain/asgardex-util';
import { TokenAmount, tokenAmount } from '@thorchain/asgardex-token';
import { DoubleSwapCalcData } from '../../../Swap/calc';
import * as calc from '../../../Swap/calc';
import { Maybe } from '../../../../types/bepswap';

export const data: DoubleSwapCalcData = {
  X: tokenAmount(1000),
  Y: tokenAmount(1000000),
  R: tokenAmount(2500000),
  Z: tokenAmount(5000000),
  Py: bn(0.04),
  Pr: bn(0.04),
};

export const getYValue = (xValue: TokenAmount) => calc.getYValue(xValue, data);

export const getZValue = (xValue: TokenAmount) => calc.getZValue(xValue, data);

export const getPx = (xValue: Maybe<TokenAmount>) => calc.getPx(xValue, data);

export const getPz = (xValue?: Maybe<TokenAmount>) => calc.getPz(xValue, data);

export const getVx = (xValue: TokenAmount): TokenAmount => {
  // formula: xValue * getPx(xValue)
  const pX = getPx(xValue);
  const value = xValue.amount().multipliedBy(pX);
  return tokenAmount(value);
};

export const getVz = (xValue: TokenAmount): TokenAmount => {
  // formula: getZValue(xValue) * getPz(xValue)
  const z = getZValue(xValue).amount();
  const pZ = getPz(xValue);
  const value = z.multipliedBy(pZ);
  return tokenAmount(value);
};

export const getSlip = (xValue: TokenAmount) => calc.getSlip(xValue, data);

export const getBalanceA = (yValue: TokenAmount): TokenAmount => {
  const { Y, Py } = data;
  // formula: (Y - yValue) * Py;
  const value = Y.amount()
    .minus(yValue.amount())
    .multipliedBy(Py);
  return tokenAmount(value);
};

export const getBalanceB = (yValue: TokenAmount): TokenAmount => {
  const { R, Pr } = data;
  // formula: (R + yValue) * Pr;
  const value = R.amount()
    .plus(yValue.amount())
    .multipliedBy(Pr);
  return tokenAmount(value);
};
