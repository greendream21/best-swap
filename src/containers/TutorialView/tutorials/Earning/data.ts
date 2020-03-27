import BigNumber from 'bignumber.js';
import { util } from 'asgardex-common';
import * as calc from '../../../Pool/calc';
import { Maybe } from '../../../../types/bepswap';
import { TokenAmount } from '../../../../types/token';
import { tokenAmount } from '../../../../helpers/tokenHelper';

export type EarningCalcData = {
  R: TokenAmount;
  T: TokenAmount;
  WR: TokenAmount;
  WT: TokenAmount;
  VWR: TokenAmount;
  SS: TokenAmount;
  Pr: BigNumber;
  Pt: BigNumber;
};

export const data: EarningCalcData = {
  R: tokenAmount(2000000),
  T: tokenAmount(4000000),
  WR: tokenAmount(2200000),
  WT: tokenAmount(4400000),
  VWR: tokenAmount(88000),
  SS: tokenAmount(50),
  Pr: util.bn(0.04),
  Pt: util.bn(0.02),
};

export const getVr = (rValue: Maybe<TokenAmount>): TokenAmount =>
  calc.getVr(rValue, data);

export const getRSlip = (rValue: TokenAmount): TokenAmount =>
  calc.getRSlip(rValue, data);

export const getTSlip = (tValue: TokenAmount): TokenAmount =>
  calc.getTSlip(tValue, data);

export const getWr = (wss: TokenAmount): TokenAmount => {
  const { SS, WR } = data;
  // formula: (wss / 100) * (SS / 100) * WR
  const wssDiv = wss.amount().div(100);
  const ssDiv = SS.amount().div(100);
  const value = wssDiv.multipliedBy(ssDiv).multipliedBy(WR.amount());
  return tokenAmount(value);
};

export const getWt = (wss: TokenAmount): TokenAmount => {
  const { SS, WT } = data;
  // forumula: (wss / 100) * (SS / 100) * WT;
  const wssDiv = wss.amount().div(100);
  const ssDiv = SS.amount().div(100);
  const value = wssDiv.multipliedBy(ssDiv).multipliedBy(WT.amount());
  return tokenAmount(value);
};

export const getSSValue = (
  rValue: TokenAmount,
  tValue: TokenAmount,
): TokenAmount => {
  if (rValue.amount().isEqualTo(0) || tValue.amount().isEqualTo(0)) {
    return tokenAmount(0);
  }
  // formula: (rValue / tValue) * 100;
  const value = rValue
    .amount()
    .div(tValue.amount())
    .multipliedBy(100);
  return tokenAmount(value);
};

export const getVssValue = (
  rValue: TokenAmount,
  tValue: TokenAmount,
): TokenAmount => {
  const Vr = getVr(rValue);
  const Vt = Vr;

  // formula: (getSSValue(rValue, tValue) / 100) * (Vr + Vt)
  const ss = getSSValue(rValue, tValue);
  const ssDiv = ss.amount().div(100);
  const sum = Vr.amount().plus(Vt.amount());
  const value = ssDiv.multipliedBy(sum);
  return tokenAmount(value);
};

export const getSS = (wss: TokenAmount): TokenAmount => {
  const { SS } = data;
  // formula SS - (wss / 100) * SS;
  const wssss = wss
    .amount()
    .div(100)
    .multipliedBy(SS.amount());
  const value = SS.amount().minus(wssss);
  return tokenAmount(value);
};

export const getVss = (wss: TokenAmount): TokenAmount => {
  const { WR, WT } = data;
  const ssValue = getVssValue(WR, WT);
  // formula: ssValue - (wss / 100) * ssValue;
  const wssss = wss
    .amount()
    .div(100)
    .multipliedBy(ssValue.amount());
  const value = ssValue.amount().minus(wssss);
  return tokenAmount(value);
};
