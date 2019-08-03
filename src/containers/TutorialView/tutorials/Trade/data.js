export const data = {
  X: 1000000,
  Y: 40000,
  Px: 0.04,
  xm: 1.2,
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

export const getPy = (xValue, yValue) => {
  const { Y, Px } = data;

  if (yValue) {
    return getVy(xValue) / (Y - yValue);
  }
  return Px;
};

export const getXValue = xValue => {
  return xValue * getVx(xValue);
};

export const getYValue = (xValue, yValue) => {
  return yValue * getVy(xValue);
};

export const getGain = (xValue, yValue) => {
  return getYValue(xValue, yValue) - getXValue(xValue);
};
