import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import { media } from '../../../helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  background-color: ${palette('background', 2)};
  padding: 0;

  .content-loader {
    rect {
      width: 100%;
      ${media.sm`
        display: 80%;
      `}
    }
  }

  .view-title {
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
    display: none;
    ${media.sm`
      display: block;
    `}

    &.mobile-view {
      display: block;
      ${media.sm`
        display: none;
      `}
    }

    .swap-card {
      margin-bottom: 10px;
    }
  }
`;
