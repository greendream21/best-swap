import { DoubleSwapCalcData } from '../../../Swap/calc';
import * as calc from '../../../Swap/calc';
import { Maybe } from '../../../../types/bepswap';

export const data: DoubleSwapCalcData = {
  X: 1000,
  Y: 1000000,
  R: 2500000,
  Z: 5000000,
  Py: 0.04,
  Pr: 0.04,
};

export const getYValue = (xValue: number) => calc.getYValue(xValue, data);

export const getZValue = (xValue: number) => calc.getZValue(xValue, data);

export const getPx = (xValue: Maybe<number>) => calc.getPx(xValue, data);

export const getPz = (xValue?: Maybe<number>) => calc.getPz(xValue, data);

export const getVx = (xValue: number) => {
  return xValue * getPx(xValue);
};

export const getVz = (xValue: number) => {
  return getZValue(xValue) * getPz(xValue);
};

export const getSlip = (xValue: number) => calc.getSlip(xValue, data);

export const getBalanceA = (yValue: number) => {
  const { Y, Py } = data;

  return (Y - yValue) * Py;
};

export const getBalanceB = (yValue: number) => {
  const { R, Pr } = data;

  return (R + yValue) * Pr;
};
