import BigNumber from 'bignumber.js';

export const DEFAULT_BN_FORMAT: BigNumber.Format = {
  // the decimal separator
  decimalSeparator: '.',
  // the grouping separator of the integer part
  groupSeparator: ',',
  // the primary grouping size of the integer part
  groupSize: 3,
  // the secondary grouping size of the integer part
  secondaryGroupSize: 0,
  // the grouping separator of the fraction part
  fractionGroupSeparator: ' ',
  // the grouping size of the fraction part
  fractionGroupSize: 0,
};

export const CONFIRM_DISMISS_TIME = 2000;
