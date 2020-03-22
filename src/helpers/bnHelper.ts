import BigNumber from 'bignumber.js';

/**
 * Shortcut to create a BigNumber
 */
export const bn = (value: BigNumber.Value) => new BigNumber(value);

/**
 * Constant to have `0` defined as a BigNumber
 */
export const BN_ZERO = new BigNumber(0);

/**
 * Constant to have `1` defined as a BigNumber
 */
export const BN_ONE = new BigNumber(1);

/**
 * Helper to check whether a BigNumber is valid or not
 * */
export const isValidBN = (value: BigNumber) => !value.isNaN();

/**
 * Helper to create a big number from string or number
 * If it fails to create a big number, a big number with value 0 will be returned instead
 * */
export const bnOrZero = (value: string | number | undefined) => {
  const bn = value ? new BigNumber(value) : BN_ZERO;
  return isValidBN(bn) ? bn : BN_ZERO;
};

/**
 * Helper to validate a possible BigNumber
 * If the given valie is invalid or undefined, 0 is returned as a BigNumber
 */
export const validBNOrZero = (value: BigNumber | undefined) =>
  value && isValidBN(value) ? value : BN_ZERO;

/**
 * Format a BaseNumber to a string depending on given decimal places
 * */
export const formatBN = (value: BigNumber, decimalPlaces = 2) =>
  value.toFormat(decimalPlaces);

/**
 * Formats a big number value by prefixing it with `$`
 */
export const formatBNCurrency = (n: BigNumber) => `$${formatBN(n)}`;

/**
 * Helper to get a fixed `BigNumber`
 * Returns zero `BigNumber` if `value` is invalid
 * */
export const fixedBN = (
  value?: number | string | BigNumber,
  point = 2,
): BigNumber => {
  const n = bn(value || 0);
  const fixedBN = isValidBN(n) ? n.toFixed(point) : BN_ZERO.toFixed(point);
  return bn(fixedBN);
};
