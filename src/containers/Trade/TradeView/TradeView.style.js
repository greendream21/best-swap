import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  background-color: ${palette('background', 2)};
  padding: 0;

  .trade-list-view {
    padding-top: 20px;
    .trade-card {
      margin-bottom: 10px;
    }
  }
`;
