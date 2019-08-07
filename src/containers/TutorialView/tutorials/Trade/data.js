export const data = {
  X: 1000000,
  Y: 40000,
  Px: 0.04,
  Py: 1,
  xm: 1.2,
};

export const getY = xValue => {
  const { X, Y } = data;
  const times = (xValue + X) ** 2;
  const yValue = (xValue * X * Y) / times;

  return yValue;
};

export const getVx = xValue => {
  const { X, Px } = data;

  if (xValue) {
    return (xValue + X) * Px;
  }

  return X * Px;
};

export const getVy = xValue => {
  return getVx(xValue);
};

export const getPy = xValue => {
  const { Y, Py } = data;
  const yValue = getY(xValue);

  if (xValue) {
    return getVy(xValue) / (Y - yValue);
  }
  return Py;
};

export const getXValue = xValue => {
  const { Px } = data;

  return xValue * Px;
};

export const getYValue = xValue => {
  const { xm } = data;
  const yValue = getY(xValue);

  return yValue * xm;
};

export const getGain = xValue => {
  return getYValue(xValue) - getXValue(xValue);
};

export const getDelta = xValue => {
  const { xm } = data;
  const Py = getPy(xValue);

  return Math.round((xm - Py) * 100);
};
