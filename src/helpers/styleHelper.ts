// TODO: Turn a few of these useless linting rules off?
/* eslint-disable implicit-arrow-linebreak */

import React from 'react';

import { omit } from 'lodash';
import { css } from 'styled-components';

import { FixmeType } from 'types/bepswap';

type MediaQueriesType = {
  [key: string]: string;
};

// SC Media breakpoints utility
const mediaQueries: MediaQueriesType = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
};

type FirstArg = FixmeType;
type ExtraArgs = string[];
type ArgType = [FirstArg, ...ExtraArgs];

export const media: FixmeType = Object.keys(mediaQueries).reduce(
  (acc, segment) => {
    const styledMediaFunction = (...args: ArgType) => css`
      @media ${mediaQueries[segment]} {
        ${css(...args)};
      }
    `;
    return {
      ...acc,
      [segment]: styledMediaFunction,
    };
  },
  {},
);

export const cleanTag = (component: FixmeType, tagList = ['']) => (
  props: FixmeType,
) => React.createElement(component, omit(props, tagList));

export function provideResponsiveShow({ showFrom }: { showFrom: string }) {
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

export function provideResponsiveHide({ hideFrom }: { hideFrom: string }) {
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
