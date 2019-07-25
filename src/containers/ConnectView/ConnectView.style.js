import styled from 'styled-components';

import ContentView from '../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  & > .ant-row {
    display: flex;
  }

  .connect-view-content {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex: auto;

    .connect-view-content-buttons {
      padding: 10px 0;

      button {
        height: 50px;
        min-width: 180px;
        margin-bottom: 20px;
      }
    }

    .connect-view-content-form {
      flex-grow: 1;
      padding-left: 40px;
    }
  }

  .bottom-nav-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
`;
