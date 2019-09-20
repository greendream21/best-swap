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

export const getActualValue = value => {
  if (value) {
    return Number((value / BASE_NUMBER).toFixed(2));
  }

  return 0;
};

export const getFixedNumber = value => {
  return Number(Number(value).toFixed(2));
};
