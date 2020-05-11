// TODO (Rudi): conflicts with prettier
/* eslint-disable operator-linebreak */
import styled, { css } from 'styled-components';
import { palette } from 'styled-theme';
import {
  provideResponsiveShow,
  media,
  cleanTag,
} from '../../helpers/styleHelper';

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  border-radius: 4px;
  background-color: ${palette('background', 1)};
  padding: 0 20px;

  .status-wrapper {
    &.pool-status {
      width: 120px;
    }

    width: 100px;
  }
`;

function provideClampWidth({ clamp }) {
  return clamp
    ? css`
        flex-shrink: 0;
        width: ${clamp}px;
      `
    : '';
}

function provideMaxMin({ max, min }) {
  return css`
    min-width: 0;
    ${max &&
      css`
        flex-grow: 0;
        flex-basis: ${max}px;
        max-width: ${max}px;
      `}

    ${min &&
      css`
        min-width: ${min}px;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: ${min}px;
      `}
  `;
}

function provideNoShrink({ noShrink }) {
  return noShrink
    ? css`
        flex-shrink: 0;
      `
    : '';
}

function provideMargin() {
  return css`
    margin-right: 10px;

    ${media.sm`
      margin-right: 20px;
    `}

    ${media.lg`
      margin-right: 40px;
    `}

    &:last-child {
      margin-right: 0;
    }
  `;
}

const Group = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  ${provideMargin}
`;

// need to maintain this list based on the tags from providers
const tagList = ['showFrom', 'max', 'min', 'clamp', 'noShrink'];
const cleaned = cleanTag('div', tagList);

const Item = styled(cleaned)`
  /* Provider functions */
  ${provideResponsiveShow}
  ${provideClampWidth}
  ${provideMaxMin}
  ${provideMargin}
  ${provideNoShrink}
`;

export default { Item, Group, Row };
