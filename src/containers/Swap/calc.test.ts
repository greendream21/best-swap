import { util } from 'asgardex-common';
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
import { tokenAmount } from '../../helpers/tokenHelper';

const doubleSwapCalcData: DoubleSwapCalcData = {
  X: tokenAmount(1000000),
  Y: tokenAmount(1000),
  R: tokenAmount(100000),
  Z: tokenAmount(100),
  Py: util.bn(50),
  Pr: util.bn(20),
};

const singleSwapCalcData: SingleSwapCalcData = {
  X: tokenAmount(1000000),
  Y: tokenAmount(1000),
  Py: util.bn(50),
};

const XVALUE_TOKEN = tokenAmount(1000);
const ZERO_TOKEN = tokenAmount(0);

describe('swap/calc', () => {
  describe('getYValue', () => {
    it('calculate yValue from double swap calc data', () => {
      const yValue = getYValue(XVALUE_TOKEN, doubleSwapCalcData);
      const expected = tokenAmount('0.99800299600499400699').amount();

      expect(yValue.amount()).toEqual(expected);
    });

    it('calculate yValue from single swap calc data', () => {
      const yValue = getYValue(XVALUE_TOKEN, singleSwapCalcData);
      const expected = tokenAmount('0.99800299600499400699').amount();

      expect(yValue.amount()).toEqual(expected);
    });
  });

  describe('getZValue', () => {
    it('calculate zValue from swap calc data', () => {
      const zValue = getZValue(XVALUE_TOKEN, doubleSwapCalcData);
      const expected = tokenAmount('0.00099798').amount();

      expect(zValue.amount()).toEqual(expected);
    });

    it('calculate zValue from single swap calc data with 0 x value', () => {
      const zValue = getZValue(ZERO_TOKEN, doubleSwapCalcData);
      const expected = tokenAmount('0').amount();
      expect(zValue.amount()).toEqual(expected);
    });
  });

  describe('getFee', () => {
    it('calculate fee from swap calc data', () => {
      const fee = getFee(XVALUE_TOKEN, doubleSwapCalcData);
      // TODO (Veado) Check the result of this test again, `'1e-8'` might be wrong
      const expected = tokenAmount('1e-8').amount();

      expect(fee.amount()).toEqual(expected);
    });

    it('calculate fee from single swap calc data with 0 x value', () => {
      const fee = getFee(ZERO_TOKEN, doubleSwapCalcData);

      expect(fee.amount()).toEqual(util.bn(0));
    });
  });

  describe('getPx', () => {
    it('calculate xPrice from swap calc data', () => {
      const xPrice = getPx(XVALUE_TOKEN, singleSwapCalcData);
      const expected = util.bn('0.04990019965034965035');

      expect(xPrice).toEqual(expected);
    });

    it('calculate xPrice from single swap calc data with 0 x value', () => {
      const xPrice = getPx(ZERO_TOKEN, singleSwapCalcData);
      const expected = util.bn('0.05');

      expect(xPrice).toEqual(expected);
    });
  });

  describe('getPz', () => {
    it('calculate zPrice from swap calc data', () => {
      const zPrice = getPz(XVALUE_TOKEN, doubleSwapCalcData);
      const expected = util.bn('20000.39920058394198762425');

      expect(zPrice).toEqual(expected);
    });

    it('calculate zPrice from single swap calc data with 0 x value', () => {
      const zPrice = getPz(ZERO_TOKEN, doubleSwapCalcData);
      const expected = util.bn('20000');

      expect(zPrice).toEqual(expected);
    });
  });

  describe('getSlip', () => {
    it('calculate slip from swap calc data', () => {
      const slip = getSlip(XVALUE_TOKEN, doubleSwapCalcData);
      const expected = util.bn('0.001995976120097963');

      expect(slip).toEqual(expected);
    });

    it('calculate slip from single swap calc data with 0 x value', () => {
      const slip = getSlip(ZERO_TOKEN, doubleSwapCalcData);

      expect(slip).toEqual(util.bn(0));
    });
  });
});
