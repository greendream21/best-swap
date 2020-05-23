import BigNumber from 'bignumber.js';
import { TokenAmount, tokenAmount } from '@thorchain/asgardex-token';
import { Maybe } from '../../types/bepswap';

export type StakeCalcData = {
  R: TokenAmount;
  T: TokenAmount;
  Pr: BigNumber;
  Pt: BigNumber;
};

export const getVr = (
  rValue: Maybe<TokenAmount>,
  data: Required<{ R: TokenAmount; Pr: BigNumber }>,
): TokenAmount => {
  const { R, Pr } = data;
  if (rValue) {
    // formula: (rValue + R) * Pr
    const value = rValue
      .amount()
      .plus(R.amount())
      .multipliedBy(Pr);
    return tokenAmount(value);
  }
  // formula: R * Pr
  const value = R.amount().multipliedBy(Pr);
  return tokenAmount(value);
};

export const getSS = (
  rValue: TokenAmount,
  tValue: TokenAmount,
  data: Required<{ R: TokenAmount; T: TokenAmount }>,
): TokenAmount => {
  const { R, T } = data;
  // formula: ((rValue / (rValue + R) + tValue / (tValue + T)) / 2) * 100;
  const rRValue = rValue.amount().plus(R.amount());
  const rTValue = tValue.amount().plus(T.amount());

  const rResult = rValue.amount().div(rRValue);
  const tResult = tValue.amount().div(rTValue);

  const value = rResult
    .plus(tResult)
    .div(2)
    .multipliedBy(100);
  return tokenAmount(value);
};

export const getVss = (
  rValue: TokenAmount,
  tValue: TokenAmount,
  data: Required<{ R: TokenAmount; Pr: BigNumber; T: TokenAmount }>,
): TokenAmount => {
  const Vr = getVr(rValue, data);
  const Vt = Vr;
  // formula: (getSS(rValue, tValue, data) / 100) * (Vr + Vt)
  const ss = getSS(rValue, tValue, data);
  const sum = Vr.amount().plus(Vt.amount());
  const value = ss
    .amount()
    .div(100)
    .multipliedBy(sum);
  return tokenAmount(value);
};

export const getRSlip = (
  rValue: TokenAmount,
  data: Required<{ R: TokenAmount }>,
): TokenAmount => {
  const { R } = data;
  // formula: (rValue + R) ** 2
  const times = rValue
    .amount()
    .plus(R.amount())
    .pow(2);
  // formula: ((rValue * (2 * R + rValue)) / times) * 100;
  const rValueX = R.amount()
    .multipliedBy(2)
    .plus(rValue.amount());
  const value = rValue
    .amount()
    .multipliedBy(rValueX)
    .div(times)
    .multipliedBy(100);
  return tokenAmount(value);
};

export const getTSlip = (
  tValue: TokenAmount,
  data: Required<{ T: TokenAmount }>,
): TokenAmount => {
  const { T } = data;
  // formula (tValue + T) ** 2;
  const times = tValue
    .amount()
    .plus(T.amount())
    .pow(2);
  // formula: (tValue * (2 * T + tValue)) / times;
  const tValueX = T.amount()
    .multipliedBy(2)
    .plus(tValue.amount());
  const value = tValue
    .amount()
    .multipliedBy(tValueX)
    .div(times);
  return tokenAmount(value);
};
