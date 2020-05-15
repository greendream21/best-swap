import themes from '@thorchain/asgardex-theme';

export const lightTheme = { name: 'Light', ...themes.light };
export const darkTheme = { name: 'Dark', ...themes.dark };
export const defaultTheme = lightTheme;

export type CoinType =
  | 'blue'
  | 'check'
  | 'bnb'
  | 'bolt'
  | 'rune'
  | 'ankr'
  | 'ftm'
  | 'tomo'
  | 'elrond'
  | 'raven'
  | 'mith'
  | 'cos';

export const coinGroup = [
  'blue',
  'check',
  'bnb',
  'bolt',
  'rune',
  'ankr',
  'ftm',
  'tomo',
  'elrond',
  'raven',
  'mith',
  'cos',
];
