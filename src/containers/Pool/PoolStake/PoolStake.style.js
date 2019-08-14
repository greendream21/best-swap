import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  padding: 0;

  & > .ant-row {
    display: flex;
  }

  .stake-status-view {
    height: 150px;
    border-bottom: 1px solid ${palette('border', 0)};
  }

  .share-view {
    flex-grow: 1;

    .your-share-view {
      border-right: 1px solid ${palette('border', 0)};
    }
  }
`;
