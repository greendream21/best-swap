import styled from 'styled-components';
import { palette } from 'styled-theme';

const sizes = {
  big: '40px',
  normal: '32px',
  small: '32px',
};

const fontSizes = {
  big: '12px',
  normal: '9px',
  small: '9px',
};

export const DynamicCoinWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${props => sizes[props.size]};
  height: ${props => sizes[props.size]};
  border-radius: 50%;
  font-size: ${props => fontSizes[props.size]};
  font-weight: bold;
  letter-spacing: 0.3px;

  ${props =>
    `background: linear-gradient(45deg, ${props.startCol}, ${props.stopCol})`};
  color: ${palette('text', 3)};
  text-transform: uppercase;
  box-shadow: 0px 2px 4px ${palette('secondary', 1)};
`;
