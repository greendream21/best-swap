import styled from 'styled-components';

export const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  letter-spacing: 1px;

  .status-title {
    padding-bottom: 4px;
  }
  .status-value {
    padding-top: 4px;
    font-size: 13px;
    text-transform: uppercase;
  }
`;
