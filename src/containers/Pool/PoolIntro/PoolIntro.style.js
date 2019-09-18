import styled from 'styled-components';

import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  & > .ant-row {
    display: flex;
  }

  .pool-content-text {
    .label-wrapper {
      padding: 4px 0;
    }
  }

  .rune-diagram-wrapper {
    display: flex;
    flex-grow: 1;
    align-items: center;
    height: 100%;

    .ant-row {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .user-avatar-image {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .rune-diagram {
      .rune-bnb-diagram,
      .rune-eth-diagram {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 5px 0;
      }
    }
  }

  .bottom-nav-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;
