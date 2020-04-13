import styled from 'styled-components';
import { media } from '../../../../helpers/styleHelper';

export const TokenCardWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .title-label {
    text-transform: uppercase;
    padding-bottom: 6px;
  }

  .token-card-content {
    display: flex;
    flex-direction: column;
    ${media.sm`
      flex-direction: row;
      align-items: center;
      min-width: 450px;
    `}

    .tokenInput-wrapper {
      flex-grow: 1;
      margin-right: 0;
      margin-bottom: 10px;

      ${media.sm`
        width: 50%;
        margin-bottom: 0;
        margin-right: 12px;
      `}
    }

    .tokenSelect-wrapper {
      flex-grow: 1;
      width: auto;
      ${media.sm`
        width: 50%;
      `}
    }
  }
`;
