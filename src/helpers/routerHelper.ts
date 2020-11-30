import { matchPath } from 'react-router-dom';

import { Maybe, Nothing, Pair } from 'types/bepswap';

import { getSymbolPair } from './stringHelper';

/**
 * Helper to check if any page is related to a path
 * */
const isPage = (path: string, pagePath: string): boolean => {
  const match = matchPath(path, {
    path: pagePath,
    exact: true,
    strict: true,
  });
  return (match && match.path !== undefined) || false;
};

/**
 * Checks if the current path points to Pool page
 * */
export const isPoolPage = (path: string): boolean =>
  isPage(path, '/pool/:symbol?');

/**
 * Returns the Pair of a SwapDetail page by parsing the path
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
 * Returns the symbol of a Pool page by parsing the path
 * */
export const matchPoolSymbol = (path: string): Maybe<string> => {
  const match = matchPath<{ symbol?: string }>(path, {
    path: '/pool/:symbol',
    exact: true,
    strict: true,
  });
  const symbol = match?.params?.symbol ?? Nothing;
  return symbol;
};
