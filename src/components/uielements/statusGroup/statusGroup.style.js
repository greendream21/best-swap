import styled from 'styled-components';

export const StatusGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;

  .group-title {
    text-transform: uppercase;
    .label-wrapper {
      padding: 8px 0;
    }
  }

  .status-group-content {
    display: flex;
    .status-value {
      display: flex;
      flex-direction: column;
      padding-right: 30px;
      .label-wrapper {
        padding: 4px 0;
      }
    }
  }
`;
