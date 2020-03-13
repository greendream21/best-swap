import { Maybe } from '../../types/bepswap';

export type StakeCalcData = {
  R: number;
  T: number;
  Pr: number;
  Pt: number;
};

export const getVr = (
  rValue: Maybe<number>,
  data: Required<{ R: number; Pr: number }>,
): number => {
  const { R, Pr } = data;
  if (rValue) {
    return (rValue + R) * Pr;
  }
  return R * Pr;
};

export const getSS = (
  rValue: number,
  tValue: number,
  data: Required<{ R: number; T: number }>,
): number => {
  const { R, T } = data;
  return ((rValue / (rValue + R) + tValue / (tValue + T)) / 2) * 100;
};

export const getVss = (
  rValue: number,
  tValue: number,
  data: Required<{ R: number; Pr: number; T: number }>,
): number => {
  const Vr = getVr(rValue, data);
  const Vt = Vr;
  return (getSS(rValue, tValue, data) / 100) * (Vr + Vt);
};

export const getRSlip = (
  rValue: number,
  data: Required<{ R: number }>,
): number => {
  const { R } = data;
  const times = (rValue + R) ** 2;
  return ((rValue * (2 * R + rValue)) / times) * 100;
};

export const getTSlip = (
  tValue: number,
  data: Required<{ T: number }>,
): number => {
  const { T } = data;
  const times = (tValue + T) ** 2;
  return (tValue * (2 * T + tValue)) / times;
};
