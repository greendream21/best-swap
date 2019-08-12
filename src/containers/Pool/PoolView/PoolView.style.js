import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${palette('background', 2)};
  padding: 0;

  .add-new-pool {
    display: flex;
    align-items: center;
    padding-top: 10px;

    .label-wrapper {
      padding-left: 20px;
    }
  }

  .pool-list-view {
    padding-top: 20px;
    .pool-card {
      margin-bottom: 10px;
    }
  }
`;
