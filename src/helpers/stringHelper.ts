import BigNumber from 'bignumber.js';
import { Token } from '@thorchain/asgardex-binance';
import { TokenAmount, formatTokenAmount } from '@thorchain/asgardex-token';
import { Maybe, Nothing, Pair } from '../types/bepswap';

export const getSymbolPair = (symbolPair?: string): Pair => ({
  source: symbolPair?.split(':')[0]?.toUpperCase() ?? Nothing,
  target: symbolPair?.split(':')[1]?.toUpperCase() ?? Nothing,
});

export const getTickerFormat = (symbol?: Maybe<string>): string => {
  if (!symbol) return '';
  if (symbol.includes('.')) {
    return symbol
      .split('.')[1]
      .split('-')[0]
      .toLowerCase();
  }

  return symbol.split('-')[0].toLowerCase();
};

export const compareShallowStr = (str1: string, str2: string): boolean => {
  try {
    return str1.toLowerCase() === str2.toLowerCase();
  } catch (error) {
    return false;
  }
};

export const isShortFormatPossible = (
  amount: BigNumber | number,
  decimal = 3,
) => {
  if (Number(amount.toFixed(decimal)) === 0) return false;
  return true;
};

export const getShortAmount = (amount: BigNumber | number, decimal = 3) => {
  if (isShortFormatPossible(amount, decimal)) return amount.toFixed(decimal);
  return amount.toFixed(8);
};

export const getShortTokenAmount = (amount: TokenAmount) => {
  if (formatTokenAmount(amount) === '0.00' && !amount.amount().isEqualTo(0)) {
    return formatTokenAmount(amount, 8);
  }
  return formatTokenAmount(amount);
};

export const getTokenName = (tokenList: Token[], assetName: string): string => {
  const token = tokenList.find(item => item.symbol === assetName);
  return token ? token.name.toUpperCase() : assetName.toUpperCase();
};

export const emptyString = '';
