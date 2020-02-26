import { css } from 'styled-components';
import {
  provideResponsiveShow,
  provideResponsiveHide,
  media,
} from './styleHelper';

describe('helpers/styleHelper', () => {
  describe('provideResponsiveShow', () => {
    it('should provide css tags for the xs responsive show', () => {
      const result = provideResponsiveShow({ showFrom: 'xs' });
      // prettier-ignore
      const expected = css`
      display: none;
      ${media.xs`
        display: block;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the sm responsive show', () => {
      const result = provideResponsiveShow({ showFrom: 'sm' });
      // prettier-ignore
      const expected = css`
      display: none;
      ${media.sm`
        display: block;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the sm responsive show', () => {
      const result = provideResponsiveShow({ showFrom: 'sm' });
      // prettier-ignore
      const expected = css`
      display: none;
      ${media.sm`
        display: block;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the lg responsive show', () => {
      const result = provideResponsiveShow({ showFrom: 'lg' });
      // prettier-ignore
      const expected = css`
      display: none;
      ${media.lg`
        display: block;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the xl responsive show', () => {
      const result = provideResponsiveShow({ showFrom: 'xl' });
      // prettier-ignore
      const expected = css`
      display: none;
      ${media.xl`
        display: block;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the xxl responsive show', () => {
      const result = provideResponsiveShow({ showFrom: 'xxl' });
      // prettier-ignore
      const expected = css`
      display: none;
      ${media.xxl`
        display: block;
      `}
    `;
      expect(result).toEqual(expected);
    });
  });

  describe('provideResponsiveHide', () => {
    it('should provide css tags for the xs responsive show', () => {
      const result = provideResponsiveHide({ hideFrom: 'xs' });
      // prettier-ignore
      const expected = css`
      display: block;
      ${media.xs`
        display: none;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the sm responsive show', () => {
      const result = provideResponsiveHide({ hideFrom: 'sm' });
      // prettier-ignore
      const expected = css`
      display: block;
      ${media.sm`
        display: none;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the sm responsive show', () => {
      const result = provideResponsiveHide({ hideFrom: 'sm' });
      // prettier-ignore
      const expected = css`
      display: block;
      ${media.sm`
        display: none;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the lg responsive show', () => {
      const result = provideResponsiveHide({ hideFrom: 'lg' });
      // prettier-ignore
      const expected = css`
      display: block;
      ${media.lg`
        display: none;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the xl responsive show', () => {
      const result = provideResponsiveHide({ hideFrom: 'xl' });
      // prettier-ignore
      const expected = css`
      display: block;
      ${media.xl`
        display: none;
      `}
    `;
      expect(result).toEqual(expected);
    });
    it('should provide css tags for the xxl responsive show', () => {
      const result = provideResponsiveHide({ hideFrom: 'xxl' });
      // prettier-ignore
      const expected = css`
      display: block;
      ${media.xxl`
        display: none;
      `}
    `;
      expect(result).toEqual(expected);
    });
  });
});
