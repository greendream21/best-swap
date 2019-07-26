import styled from 'styled-components';

import ContentView from '../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  & > .ant-row {
    display: flex;
  }

  .network-blocks {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
  }

  .ant-table {
    .label-wrapper {
      padding: 0;
    }
  }
`;
