import * as calc from '../../../Pool/calc';
import { Maybe } from '../../../../types/bepswap';

export type EarningCalcData = {
  R: number;
  T: number;
  WR: number;
  WT: number;
  VWR: number;
  SS: number;
  Pr: number;
  Pt: number;
};

export const data: EarningCalcData = {
  R: 2000000,
  T: 4000000,
  WR: 2200000,
  WT: 4400000,
  VWR: 88000,
  SS: 50,
  Pr: 0.04,
  Pt: 0.02,
};

export const getVr = (rValue: Maybe<number>) => calc.getVr(rValue, data);

// TODO (Veado): This func seems not to be used in `Earnings
export const getRSlip = (rValue: number) => calc.getRSlip(rValue, data);

export const getTSlip = (tValue: number) => calc.getTSlip(tValue, data);

export const getWr = (wss: number) => {
  const { SS, WR } = data;
  return (wss / 100) * (SS / 100) * WR;
};

export const getWt = (wss: number) => {
  const { SS, WT } = data;
  return (wss / 100) * (SS / 100) * WT;
};

export const getSSValue = (rValue: number, tValue: number) => {
  if (rValue === 0 || tValue === 0) {
    return 0;
  }
  return (rValue / tValue) * 100;
};

export const getVssValue = (rValue: number, tValue: number) => {
  const Vr = getVr(rValue);
  const Vt = Vr;

  return (getSSValue(rValue, tValue) / 100) * (Vr + Vt);
};

export const getSS = (wss: number) => {
  const { SS } = data;

  return SS - (wss / 100) * SS;
};

export const getVss = (wss: number) => {
  const { WR, WT } = data;
  const ssValue = getVssValue(WR, WT);

  return ssValue - (wss / 100) * ssValue;
};
