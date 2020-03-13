import { Maybe } from '../../types/bepswap';

export type DoubleSwapCalcData = {
  X: number;
  Y: number;
  R: number;
  Z: number;
  Py: number;
  Pr: number;
};

export type SingleSwapCalcData = {
  X: number;
  Y: number;
  Py: number;
};

// Calculations
export const getYValue = (
  xValue: number,
  data: DoubleSwapCalcData | SingleSwapCalcData,
) => {
  const { X, Y } = data;
  const times = (xValue + X) ** 2;
  const yValue = (xValue * X * Y) / times;

  return yValue;
};

export const getZValue = (xValue: number, data: DoubleSwapCalcData) => {
  const { R, Z } = data;
  const yValue = getYValue(xValue, data);
  const times = (yValue + R) ** 2;

  return (yValue * R * Z) / times;
};

export const getFee = (xValue: number, data: DoubleSwapCalcData) => {
  const { R, Z } = data;
  const yValue = getYValue(xValue, data);
  const times = (yValue + R) ** 2;
  const yTimes = yValue ** 2;

  return (yTimes * Z) / times;
};

export const getPx = (xValue: Maybe<number>, data: SingleSwapCalcData) => {
  const { X, Y, Py } = data;

  if (xValue) {
    const yValue = getYValue(xValue, data);
    return (Py * (Y - yValue)) / (X + xValue);
  }

  return (Py * Y) / X;
};

export const getPz = (xValue: Maybe<number>, data: DoubleSwapCalcData) => {
  const { Z, R, Pr } = data;

  if (xValue) {
    const zValue = getZValue(xValue, data);
    const yValue = getYValue(xValue, data);

    return (Pr * (R + yValue)) / (Z - zValue);
  }

  return (Pr * R) / Z;
};

export const getSlip = (xValue: number, data: DoubleSwapCalcData) => {
  const { R } = data;
  const yValue = getYValue(xValue, data);
  const times = (yValue + R) ** 2;

  return ((yValue * (2 * R + yValue)) / times) * 100;
};
