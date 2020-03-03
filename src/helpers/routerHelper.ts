import { matchPath } from 'react-router-dom';
import { Maybe, Nothing, Pair } from '../types/bepswap';
import { getPair } from './stringHelper';

/**
 * Helper to check if any page is related to a path
 * */
const isPage = (path: string, pagePath: string): boolean => {
    const match = matchPath<{path?: string}>(path, {
      path: pagePath,
      exact: true,
      strict: true,
    });
    return (match && match.path !== undefined) || false;
};

/**
 * Checks if the current path points to SwapDetail page
 * */
export const isSwapDetailPage = (path: string): boolean => isPage(path, '/swap/detail/:pair?');

/**
 * Checks if the current path points to Pool page
 * */
export const isPoolPage = (path: string): boolean => isPage(path, '/pool/:symbol?');

/**
 * Returns the Pair of a SwapDetail page by parsing the path
 * */
export const matchSwapDetailPair = (path: string): Maybe<Pair> => {
  const match = matchPath<{pair?: string}>(path, {
      path: '/swap/detail/:pair',
      exact: true,
      strict: true,
    });
  const pair = match?.params?.pair ?? Nothing;
  return pair ? getPair(pair) : Nothing;
};

/**
 * Returns the Pair of a Pool page by parsing the path
 * */
export const matchPoolSymbol = (path: string): Maybe<string> => {
  const match = matchPath<{symbol?: string}>(path, {
      path: '/pool/:symbol',
      exact: true,
      strict: true,
    });
  const symbol = match?.params?.symbol ?? Nothing;
  return symbol;
};
