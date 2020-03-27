import BigNumber from 'bignumber.js';
import { util } from 'asgardex-common';
import { Denomination, TokenAmount, BaseAmount, Amounts } from '../types/token';

/**
 * Number of token decimals - For binance chain tokens only!
 * For example:
 * RUNE has a maximum of 8 digits of decimal
 * 0.00000001 RUNE == 1 ð (tor)
 * */
export const TOKEN_DECIMAL = 8;

/**
 * Base number of tokens - For binance chain tokens only!
 * For example:
 * The amount of RUNE is boosted by 1e8 for decimal part
 * 1 RUNE == 100,000,000 ð (tor)
 */
export const BASE_NUMBER = 10 ** TOKEN_DECIMAL; // 1e8

/**
 * Factory to create any values of tokens (e.g. RUNE)
 * If the value is undefined, 0 is returned
 * */
export const tokenAmount = (
  value?: string | number | BigNumber | undefined,
  decimal: number = TOKEN_DECIMAL,
) =>
  ({
    type: Denomination.TOKEN,
    amount: () => util.fixedBN(value, decimal),
  } as TokenAmount);

/**
 * Factory to create base amounts (e.g. tor)
 * If the value is undefined, 0 is returned
 * */
export const baseAmount = (value?: string | number | BigNumber | undefined) =>
  ({
    type: Denomination.BASE,
    amount: () => util.fixedBN(value, 0),
  } as BaseAmount);

/**
 * Helper to convert values for a token from base values (e.g. RUNE from tor)
 * */
export const baseToToken = (
  base: BaseAmount,
  decimal: number = TOKEN_DECIMAL,
): TokenAmount => {
  const value = base
    .amount()
    .div(BASE_NUMBER)
    .decimalPlaces(decimal);
  return tokenAmount(value);
};
/**
 * Helper to convert token to base values (e.g. tor -> RUNE)
 * */
export const tokenToBase = (token: TokenAmount): BaseAmount => {
  const value = token
    .amount()
    .multipliedBy(BASE_NUMBER)
    .integerValue();
  return baseAmount(value);
};

/**
 * Guard to check whether value is an amount of token or not
 * */
export const isTokenAmount = (v: Amounts): v is TokenAmount =>
  (v as TokenAmount).type === Denomination.TOKEN ?? false;

/**
 * Guard to check whether value is an amount of a base value or not
 * */
export const isBaseAmount = (v: Amounts): v is BaseAmount =>
  (v as BaseAmount).type === Denomination.BASE ?? false;

/**
 * Formats a token value in a user friendly way,
 * depending on given decimal places
 */
export const formatTokenAmount = (token: TokenAmount, decimal = 2) =>
  util.formatBN(token.amount(), decimal);

/**
 * Formats a token value by prefixing it with `$`
 */
export const formatTokenAmountCurrency = (token: TokenAmount) =>
  `$${formatTokenAmount(token)}`;

/**
 * Format a base value as a token in a user friendly way,
 * depending on given decimal places
 */
export const formatBaseAsTokenAmount = (base: BaseAmount, decimal = 2) =>
  formatTokenAmount(baseToToken(base), decimal);
