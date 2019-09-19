import styled from 'styled-components';

const sizes = {
  big: '44px',
  small: '32px',
  normal: '28px',
};

const fontSizes = {
  big: '12px',
  small: '10px',
  normal: '9px',
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

  ${props =>
    `background: linear-gradient(45deg, ${props.startCol}, ${props.stopCol})`};
  color: white;
  text-transform: uppercase;
`;
