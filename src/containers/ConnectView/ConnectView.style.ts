import styled from 'styled-components';
import { palette } from 'styled-theme';

import ContentView from '../../components/utility/contentView';
import { media } from '../../helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  padding: 0;
  ${media.sm`
    padding: 0 30px;
  `}
  display: flex;
  justify-content: center;
  align-items: center;

  .connect-view-header {
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    padding: 30px 0;

    .connect-view-tab {
      width: 100%;

      ${media.sm`
        width: 550px;
      `}
      .ant-tabs-nav {
        padding: 0 10px;
        ${media.sm`
          padding: 0 25px;
        `}
      }

      .ant-tabs-tab {
        margin-right: 5px;
        padding-left: 2px;
        padding-right: 2px;
        font-size: 10px;
        ${media.sm`
          margin-right: 32px;
          padding-left: 10px;
          padding-right: 10px;
          font-size: 12px;
        `}
      }
    }
  }

  .connect-view-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;

    .keystore-connect-wrapper {
      width: 300px;
      .file-upload-wrapper {
        display: flex;
        align-items: center;

        .btn-wrapper {
          width: 100%;
        }
      }

      .keystore-footer {
        display: flex;
        justify-content: center;
        padding-top: 10px;
      }
    }
    .ledger-connect-wrapper {
      .ant-row {
        display: flex;
        justify-content: center;
        align-items: center;

        .ledger-guide-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .label-wrapper {
            padding: 0;
            color: ${palette('primary', 0)};
          }
        }

        .ledger-footer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
      .ledger-connect-btn {
        margin-top: 20px;
      }
    }

    .connect-view-content-form {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90%;
      padding: 60px 10px;
      border: 1px solid ${palette('gray', 0)};
      border-radius: 4px;

      ${media.sm`
        width: 495px;
        height: 488px;
        padding-top: 0px;
        padding-right: 70px;
        padding-left: 70px;
        padding-bottom: 50px;
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

export const QRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  padding: 20px;
  margin-top: 50px;
  border-radius: 5px;
  box-shadow: ${palette('primary', 0)};
  background-color: #48515d;
`;

export const KeystoreTitle = styled.div`
  display: flex;
  align-items: center;

  .label-wrapper {
    margin-right: 4px;
  }
`;
