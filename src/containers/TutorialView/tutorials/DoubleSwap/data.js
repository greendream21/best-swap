export const data = {
  X: 1000,
  Y: 1000000,
  R: 2500000,
  Z: 5000000,
  Py: 0.04,
  Pr: 0.04,
};

export const getYValue = xValue => {
  const { X, Y } = data;
  const times = (xValue + X) ** 2;
  const yValue = (xValue * X * Y) / times;

  return yValue;
};

export const getZValue = xValue => {
  const { R, Z } = data;
  const yValue = getYValue(xValue);
  const times = (yValue + R) ** 2;

  return (yValue * R * Z) / times;
};

export const getPx = xValue => {
  const { X, Y, Py } = data;

  if (xValue) {
    const yValue = getYValue(xValue);
    return (Py * (Y - yValue)) / (X + xValue);
  }

  return (Py * Y) / X;
};

export const getPz = xValue => {
  const { Z, R, Pr } = data;

  if (xValue) {
    const zValue = getZValue(xValue);
    const yValue = getYValue(xValue);

    return (Pr * (R + yValue)) / (Z - zValue);
  }

  return (Pr * R) / Z;
};

export const getVx = xValue => {
  return xValue * getPx(xValue);
};

export const getVz = xValue => {
  return getZValue(xValue) * getPz(xValue);
};

export const getSlip = xValue => {
  const { R } = data;
  const yValue = getYValue(xValue);
  const times = (yValue + R) ** 2;

  return ((yValue * (2 * R + yValue)) / times) * 100;
};

export const getBalanceA = yValue => {
  const { Y, Py } = data;

  return (Y - yValue) * Py;
};

export const getBalanceB = yValue => {
  const { R, Pr } = data;

  return (R + yValue) * Pr;
};
