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

export const getActualValue = value => {
  const BASE_NUMBER = 10 ** 8;

  if (value) {
    return Number((value / BASE_NUMBER).toFixed(2));
  }

  return 0;
};
