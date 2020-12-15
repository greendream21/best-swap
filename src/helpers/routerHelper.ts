import { matchPath } from 'react-router-dom';

import { Maybe, Nothing, Pair } from 'types/bepswap';

import { getSymbolPair } from './stringHelper';

/**
 * Helper to check if any page is related to a path
 * */
export const isValidPage = (path: string, pagePath: string): boolean => {
  const match = matchPath(path, {
    path: pagePath,
    exact: true,
    strict: true,
  });
  return (match && match.path !== undefined) || false;
};

export const isHomePage = (path: string): boolean =>
  isValidPage(path, '/') || isValidPage(path, '/pools');

export const isPoolDetailPage = (path: string): boolean =>
  isValidPage(path, '/pool/:symbol');

export const isSwapPage = (path: string): boolean =>
  isValidPage(path, '/swap/:symbolpair');

export const isPoolCreatePage = (path: string): boolean =>
  isValidPage(path, '/pool/:symbol/new');

export const isAddLiquidityPage = (path: string): boolean =>
  isValidPage(path, '/liquidity/:symbol');

export const isTransactionPage = (path: string): boolean =>
  isValidPage(path, '/transaction');

export const matchPage = {
  isHomePage,
  isPoolDetailPage,
  isSwapPage,
  isPoolCreatePage,
  isAddLiquidityPage,
  isTransactionPage,
};

/**
 * Returns the Pair of a Swap page by parsing the path
 * */
export const matchSwapDetailPair = (path: string): Maybe<Pair> => {
  const match = matchPath<{ symbolpair?: string }>(path, {
    path: '/swap/:symbolpair',
    exact: true,
    strict: true,
  });
  const symbolpair = match?.params?.symbolpair ?? Nothing;
  return symbolpair ? getSymbolPair(symbolpair) : Nothing;
};

/**
 * Returns the symbol param of a Add Liquidity page by parsing the path
 * */
export const matchAddLiquiditySymbol = (path: string): Maybe<string> => {
  const match = matchPath<{ symbol?: string }>(path, {
    path: '/liquidity/:symbol',
    exact: true,
    strict: true,
  });
  const symbol = match?.params?.symbol ?? Nothing;
  return symbol;
};

export const matchPoolDetailSymbol = (path: string): Maybe<string> => {
  const match = matchPath<{ symbol?: string }>(path, {
    path: '/pool/:symbol',
    exact: true,
    strict: true,
  });
  const symbol = match?.params?.symbol ?? Nothing;
  return symbol;
};

export const matchParam = {
  matchSwapDetailPair,
  matchAddLiquiditySymbol,
  matchPoolDetailSymbol,
};
