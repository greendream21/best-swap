import styled from 'styled-components';

export const DynamicCoinWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 12px;

  ${props =>
    `background: linear-gradient(45deg, ${props.startCol}, ${props.stopCol})`};
  color: white;
  text-transform: uppercase;
`;
