import { util } from 'asgardex-common';
import { StakeCalcData } from '../../../Pool/calc';
import * as calc from '../../../Pool/calc';
import { Maybe } from '../../../../types/bepswap';
import { tokenAmount } from '../../../../helpers/tokenHelper';
import { TokenAmount } from '../../../../types/token';

export const data: StakeCalcData = {
  R: tokenAmount(1000000),
  T: tokenAmount(2000000),
  Pr: util.bn(0.04),
  Pt: util.bn(0.02),
};

export const getVr = (rValue: Maybe<TokenAmount>): TokenAmount => calc.getVr(rValue, data);

export const getSS = (rValue: TokenAmount, tValue: TokenAmount): TokenAmount =>
  calc.getSS(rValue, tValue, data);

export const getVss = (rValue: TokenAmount, tValue: TokenAmount): TokenAmount =>
  calc.getVss(rValue, tValue, data);

export const getRSlip = (rValue: TokenAmount): TokenAmount => calc.getRSlip(rValue, data);

export const getTSlip = (tValue: TokenAmount): TokenAmount => calc.getTSlip(tValue, data);
