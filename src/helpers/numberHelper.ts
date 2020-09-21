/* eslint-disable @typescript-eslint/no-inferrable-types */
export const abbreviateNumber = (
  value: number,
  decimal: number = 0,
): string => {
  let newValue = value;
  const suffixes = ['', 'K', 'M', 'B', 't', 'q', 'Q', 's'];
  let suffixNum = 0;

  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  return `${newValue.toFixed(decimal)}${
    suffixNum > 0 ? ` ${suffixes[suffixNum]}` : ''
  }`;
};

export const abbreviateNumberFromString = (
  value: string,
  decimal: number = 2,
): string => {
  const num = parseFloat(value.replace(/,/g, ''));
  return abbreviateNumber(num, decimal);
};
