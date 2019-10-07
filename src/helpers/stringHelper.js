export const getPair = info => {
  if (info) {
    const source = info.split('-')[0];
    const target = info.split('-')[1];

    return {
      source,
      target,
    };
  }
  return {};
};

const BASE_NUMBER = 10 ** 8;

export const getUserFormat = value => {
  if (value) {
    return Number((value / BASE_NUMBER).toFixed(2));
  }

  return 0;
};

export const getBaseNumberFormat = value => {
  if (value) {
    return Number((value * BASE_NUMBER).toFixed(2));
  }

  return 0;
};

export const getFixedNumber = value => {
  return Number(Number(value).toFixed(2));
};

export const getNewValue = (value, oldValue) => {
  const numericRegex = /^[0-9\b]+$/;
  /* eslint-disable no-nested-ternary */
  const newValue =
    value.indexOf(',') !== -1
      ? parseInt(value.replace(',', ''), 10)
      : !numericRegex.test(value)
      ? 0
      : Number.isNaN(value)
      ? oldValue
      : Number(value);

  /* eslint-enable no-nested-ternary */
  return newValue;
};

export const getTickerFormat = symbol => {
  if (!symbol) return null;

  return symbol.split('-')[0].toLowerCase();
};
