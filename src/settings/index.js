import themes from './themes';

export const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};

export const defaultTheme = themes[themeConfig.theme];

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

export const coinNames = [
  {
    id: 'BNB',
    name: 'BNB',
  },
  {
    id: 'RUNE-A1F',
    name: 'RUNE',
  },
  {
    id: 'LOK-3C0',
    name: 'LOK',
  },
];
