// export const data = {
//   X: 1000,
//   Y: 1000000,
//   R: 2500000,
//   Z: 5000000,
//   Py: 0.04,
//   Pr: 0.04,
// };

export const getYValue = (xValue, data) => {
  const { X, Y } = data;
  const times = (xValue + X) ** 2;
  const yValue = (xValue * X * Y) / times;

  return yValue;
};

export const getZValue = (xValue, data) => {
  const { R, Z } = data;
  const yValue = getYValue(xValue, data);
  const times = (yValue + R) ** 2;

  return (yValue * R * Z) / times;
};

export const getPx = (xValue, data) => {
  const { X, Y, Py } = data;

  if (xValue) {
    const yValue = getYValue(xValue, data);
    return (Py * (Y - yValue)) / (X + xValue);
  }

  return (Py * Y) / X;
};

export const getPz = (xValue, data) => {
  const { Z, R, Pr } = data;

  if (xValue) {
    const zValue = getZValue(xValue, data);
    const yValue = getYValue(xValue, data);

    return (Pr * (R + yValue)) / (Z - zValue);
  }

  return (Pr * R) / Z;
};

export const getVx = (xValue, data) => {
  return xValue * getPx(xValue, data);
};

export const getVz = (xValue, data) => {
  return getZValue(xValue, data) * getPz(xValue, data);
};

export const getSlip = (xValue, data) => {
  const { R } = data;
  const yValue = getYValue(xValue, data);
  const times = (yValue + R) ** 2;

  return ((yValue * (2 * R + yValue)) / times) * 100;
};

export const getBalanceA = (yValue, data) => {
  const { Y, Py } = data;

  return (Y - yValue) * Py;
};

export const getBalanceB = (yValue, data) => {
  const { R, Pr } = data;

  return (R + yValue) * Pr;
};
