export const getVr = (rValue, data) => {
  const { R, Pr } = data;

  if (rValue) {
    return (rValue + R) * Pr;
  }

  return R * Pr;
};

export const getVt = rValue => {
  return getVr(rValue);
};

export const getSS = (rValue, tValue, data) => {
  const { R, T } = data;

  return ((rValue / (rValue + R) + tValue / (tValue + T)) / 2) * 100;
};

export const getVss = (rValue, tValue) => {
  const Vr = getVr(rValue);
  const Vt = Vr;

  return (getSS(rValue, tValue) / 100) * (Vr + Vt);
};

export const getRSlip = (rValue, data) => {
  const { R } = data;
  const times = (rValue + R) ** 2;

  return ((rValue * (2 * R + rValue)) / times) * 100;
};

export const getTSlip = (tValue, data) => {
  const { T } = data;
  const times = (tValue + T) ** 2;

  return (tValue * (2 * T + tValue)) / times;
};
