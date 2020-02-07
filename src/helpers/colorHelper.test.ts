import { rainbowStop, getIntFromName } from './colorHelper';

describe('helpers/colorHelper/', () => {
  // rainbowStop

  describe('rainbowStop', () => {
    it('should return a valid result', () => {
      const result = rainbowStop(10);
      expect(result).toEqual('#ff0000');
    });
});

  // getIntFromName

  describe('getIntFromName', () => {
    it('should return a valid value', () => {
      const result = getIntFromName('RUNE');
      expect(result).toEqual(['0.77', '0.91']);
    });
    it('should return a valid value', () => {
      const result = getIntFromName('rune');
      expect(result).toEqual(['0.77', '0.91']);
    });
  });
});
