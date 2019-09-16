// TODO: Turn a few of these useless linting rules off?
/* eslint-disable implicit-arrow-linebreak */

import React from 'react';
import { omit } from 'lodash';
import { css } from 'styled-components';

// SC Media breakpoints utility
const mediaQueries = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
};

export const media = Object.keys(mediaQueries).reduce((acc, segment) => {
  const styledMediaFunction = (...args) => css`
    @media ${mediaQueries[segment]} {
      ${css(...args)};
    }
  `;
  return {
    ...acc,
    [segment]: styledMediaFunction,
  };
}, {});

export const cleanTag = (component, tagList = []) => props =>
  React.createElement(component, omit(props, tagList));

export function provideResponsiveShow({ showFrom }) {
  return (
    showFrom &&
    css`
      display: none;
      ${media[showFrom]`
        display: block;
      `}
    `
  );
}

export function provideResponsiveHide({ hideFrom }) {
  return (
    hideFrom &&
    css`
      display: block;
      ${media[hideFrom]`
        display: none;
      `}
    `
  );
}
