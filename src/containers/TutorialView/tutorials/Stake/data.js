export const data = {
  R: 1000000,
  T: 2000000,
  Pr: 0.04,
  Pt: 0.02,
};

export const getVr = rValue => {
  const { R, Pr } = data;

  if (rValue) {
    return (rValue + R) * Pr;
  }

  return R * Pr;
};

export const getVt = rValue => {
  return getVr(rValue);
};

export const getSS = (rValue, tValue) => {
  const { R, T } = data;

  return (
    ((2 * rValue * T + rValue * T + R * tValue) * (rValue + R + tValue + T)) /
    (4 * (rValue + R) * (tValue + T))
  );
};

export const getVss = (rValue, tValue) => {
  const Vr = getVr(rValue);
  const Vt = Vr;

  return getSS(rValue, tValue) * (Vr + Vt);
};

export const getRSlip = rValue => {
  const { R } = data;
  const times = (rValue + R) ** 2;

  return (rValue * (2 * R + rValue)) / times;
};

export const getTSlip = tValue => {
  const { T } = data;
  const times = (tValue + T) ** 2;

  return (tValue * (2 * T + tValue)) / times;
};
