import styled from 'styled-components';

export const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
  }

  & > div:nth-child(2) {
    width: 20px;
    justify-content: center;
  }
  & > div:first-child {
    justify-content: flex-end;
    width: 50%;
  }
  & > div:last-child {
    width: 50%;
  }
`;
