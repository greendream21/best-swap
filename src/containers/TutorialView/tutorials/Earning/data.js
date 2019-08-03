export const data = {
  R: 2000000,
  T: 4000000,
  WR: 1100000,
  WT: 2200000,
  VWR: 44000,
  SS: 50,
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

export const getWr = wss => {
  const { SS, WR } = data;
  return (wss / 100) * (SS / 100) * WR;
};

export const getWt = wss => {
  const { SS, WT } = data;
  return (wss / 100) * (SS / 100) * WT;
};

export const getSSValue = (rValue, tValue) => {
  if (rValue === 0 || tValue === 0) {
    return 0;
  }
  return (rValue / tValue) * 100;
};

export const getVssValue = (rValue, tValue) => {
  const Vr = getVr(rValue);
  const Vt = Vr;

  return (getSSValue(rValue, tValue) / 100) * (Vr + Vt);
};

export const getSS = wss => {
  const { SS } = data;

  return SS - (wss / 100) * SS;
};

export const getVss = wss => {
  const { WR, WT } = data;
  const ssValue = getVssValue(WR, WT);

  return ssValue - (wss / 100) * ssValue;
};
