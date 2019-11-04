import styled from 'styled-components';

import ContentView from '../../components/utility/contentView';
import { media } from '../../helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  .content-view-wrapper {
    padding: 0;
    ${media.sm`
      padding: 0 30px;
    `}
  }

  .connect-view-content {
    .keystore-connect-wrapper {
      .file-upload-wrapper {
        display: flex;
        align-items: center;
      }
    }
    .ledger-connect-wrapper {
      .ledger-connect-btn {
        margin-top: 20px;
      }
    }

    .connect-view-content-buttons {
      padding: 10px 0;

      button {
        height: 50px;
        min-width: 100%;
        margin-bottom: 20px;
        ${media.sm`
          min-width: 240px;
        `}
      }
    }

    .connect-view-content-form {
      flex-grow: 1;
      padding-left: 0px;
      ${media.sm`
        padding-left: 40px;
      `}
    }
  }

  .bottom-nav-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
`;
