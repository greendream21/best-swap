import {
  getYValue,
  getZValue,
  getFee,
  getPx,
  getPz,
  getSlip,
  DoubleSwapCalcData,
  SingleSwapCalcData,
} from './calc';

const doubleSwapCalcData: DoubleSwapCalcData = {
  X: 1000000,
  Y: 1000,
  R: 100000,
  Z: 100,
  Py: 50,
  Pr: 20,
};

const singleSwapCalcData: SingleSwapCalcData = {
  X: 1000000,
  Y: 1000,
  Py: 50,
};

const XVALUE = 1000;

describe('swap/calc', () => {
  describe('getYValue', () => {
    it('calculate yValue from double swap calc data', () => {
      const yValue = getYValue(XVALUE, doubleSwapCalcData);
      const expected = 0.998002996004994;

      expect(yValue).toBe(expected);
    });

    it('calculate yValue from single swap calc data', () => {
      const yValue = getYValue(XVALUE, singleSwapCalcData);
      const expected = 0.998002996004994;

      expect(yValue).toBe(expected);
    });
  });

  describe('getZValue', () => {
    it('calculate zValue from swap calc data', () => {
      const zValue = getZValue(XVALUE, doubleSwapCalcData);
      const expected = 0.0009979830761035957;

      expect(zValue).toBe(expected);
    });

    it('calculate zValue from single swap calc data with 0 x value', () => {
      const zValue = getZValue(0, doubleSwapCalcData);

      expect(zValue).toBe(0);
    });
  });

  describe('getFee', () => {
    it('calculate fee from swap calc data', () => {
      const fee = getFee(XVALUE, doubleSwapCalcData);
      const expected = 9.959900999136684e-9;

      expect(fee).toBe(expected);
    });

    it('calculate fee from single swap calc data with 0 x value', () => {
      const fee = getFee(0, doubleSwapCalcData);

      expect(fee).toBe(0);
    });
  });

  describe('getPx', () => {
    it('calculate xPrice from swap calc data', () => {
      const xPrice = getPx(XVALUE, singleSwapCalcData);
      const expected = 0.049900199650549204;

      expect(xPrice).toBe(expected);
    });

    it('calculate xPrice from single swap calc data with 0 x value', () => {
      const xPrice = getPx(0, singleSwapCalcData);
      const expected = 0.05;

      expect(xPrice).toBe(expected);
    });
  });

  describe('getPz', () => {
    it('calculate zPrice from swap calc data', () => {
      const zPrice = getPz(XVALUE, doubleSwapCalcData);
      const expected = 20000.39920119838;

      expect(zPrice).toBe(expected);
    });

    it('calculate zPrice from single swap calc data with 0 x value', () => {
      const zPrice = getPz(0, doubleSwapCalcData);
      const expected = 20000;

      expect(zPrice).toBe(expected);
    });
  });

  describe('getSlip', () => {
    it('calculate slip from swap calc data', () => {
      const slip = getSlip(XVALUE, doubleSwapCalcData);
      const expected = 0.0019959761121081904;

      expect(slip).toBe(expected);
    });

    it('calculate slip from single swap calc data with 0 x value', () => {
      const slip = getSlip(0, doubleSwapCalcData);

      expect(slip).toBe(0);
    });
  });
});
