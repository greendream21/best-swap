import { StakeCalcData } from '../../../Pool/calc';
import * as calc from '../../../Pool/calc';
import { Maybe } from '../../../../types/bepswap';

export const data: StakeCalcData = {
  R: 1000000,
  T: 2000000,
  Pr: 0.04,
  Pt: 0.02,
};

export const getVr = (rValue: Maybe<number>) => calc.getVr(rValue, data);

export const getSS = (rValue: number, tValue: number) =>
  calc.getSS(rValue, tValue, data);

export const getVss = (rValue: number, tValue: number) =>
  calc.getVss(rValue, tValue, data);

export const getRSlip = (rValue: number) => calc.getRSlip(rValue, data);

export const getTSlip = (tValue: number) => calc.getTSlip(tValue, data);
