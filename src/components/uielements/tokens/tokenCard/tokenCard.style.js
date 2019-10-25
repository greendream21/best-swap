import styled from 'styled-components';

export const TokenCardWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .title-label {
    text-transform: uppercase;
    padding-bottom: 6px;
  }

  .token-card-content {
    display: flex;
    align-items: center;
    min-width: 450px;
    .tokenInput-wrapper {
      flex-grow: 1;
      margin-right: 12px;
    }
  }
`;
