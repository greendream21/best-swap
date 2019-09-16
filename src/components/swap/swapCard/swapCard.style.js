// TODO: conflicts with prettier
/* eslint-disable operator-linebreak */
import styled, { css } from 'styled-components';
import { media, cleanTag } from '../../../helpers/styleHelper';

export const SwapCardRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  border-radius: 4px;
  background-color: #fff;
  padding: 0 20px;
`;

function provideClampWidth({ clamp }) {
  return clamp && `width:${clamp}px;`;
}

function provideMaxMin({ max, min }) {
  if (max) {
    return `max-width: ${max}px;`;
  }

  if (min) {
    return `min-width: ${min}px;`;
  }
  return '';
}

function provideResponsiveShow({ showFrom }) {
  return (
    showFrom &&
    css`
      display: none;
      ${media[showFrom]`display:block;`}
    `
  );
}

export const SwapCardGroup = styled.div`
  display: flex;
  align-items: center;
`;

// need to maintain this list based on the tags from providers
const tagList = ['showFrom', 'max', 'min', 'clamp'];
const cleaned = cleanTag('div', tagList);

export const SwapCardItem = styled(cleaned)`
  /* Provider functions */
  ${provideResponsiveShow}
  ${provideClampWidth}
  ${provideMaxMin}

  /* Item styles */
  margin-right: 40px;

  &:last-child {
    margin-right: 0;
  }
`;
