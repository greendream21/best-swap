import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  background-color: ${palette('background', 2)};
  padding: 0;

  .view-title {
    padding-top: 10px;
    padding-left: 10px;
  }

  .asset-button-group {
    display: flex;
    align-items: center;
    padding-bottom: 10px;

    .btn-wrapper {
      width: 120px;
      margin-right: 20px;
    }
  }

  .swap-list-view {
    .swap-card {
      margin-bottom: 10px;
    }
  }
`;
