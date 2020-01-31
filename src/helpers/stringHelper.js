import { BASE_NUMBER } from '../settings/constants';

export const getPair = info => {
  if (info) {
    const source = info.split('-')[0].toLowerCase();
    const target = info.split('-')[1].toLowerCase();

    return {
      source,
      target,
    };
  }
  return {};
};

export const getUserFormat = value => {
  if (value) {
    return Number((value / BASE_NUMBER).toFixed(2));
  }

  return 0;
};

export const getBaseNumberFormat = value => {
  if (value && !Number.isNaN(parseFloat(value))) {
    return Number((value * BASE_NUMBER).toFixed(2));
  }

  return 0;
};

export const getFixedNumber = (value, point = 2) => {
  if (Number.isNaN(parseFloat(value))) return 0;
  return Number(Number(value).toFixed(point));
};

export const getTickerFormat = symbol => {
  if (!symbol) return null;
  return symbol.split('-')[0].toLowerCase();
};

export const compareShallowStr = (str1, str2) => {
  try {
    return str1.toLowerCase() === str2.toLowerCase();
  } catch (error) {
    return false;
  }
};

export const emptyString = '';
