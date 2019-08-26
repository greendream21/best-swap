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
