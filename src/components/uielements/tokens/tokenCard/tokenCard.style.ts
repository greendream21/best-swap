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
    margin-top: 6px;
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
        flex-grow: 1;
        margin-bottom: 0;
        margin-right: 20px;
      `}
    }

    .tokenSelect-wrapper {
      width: auto;
      ${media.sm`
        width: 170px;
      `}
    }
  }
`;
