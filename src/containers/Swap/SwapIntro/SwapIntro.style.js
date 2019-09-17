import styled from 'styled-components';

import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  & > .ant-row {
    display: flex;
  }

  .swap-content-pool-text {
    .label-wrapper {
      padding: 4px 0;
    }
  }

  .rune-diagram-wrapper {
    display: flex;
    flex-grow: 1;
    align-items: center;

    .rune-diagram-images,
    .rune-diagram-text {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
    }
  }

  .bottom-nav-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
  }
`;
