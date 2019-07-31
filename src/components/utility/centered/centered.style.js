import styled from 'styled-components';

export const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & > div:nth-child(2) {
    width: 10px;
    text-align: center;
  }
  & > div:first-child {
    width: 50%;
    text-align: right;
  }
  & > div:last-child {
    width: 50%;
  }
`;
