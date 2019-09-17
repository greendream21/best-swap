import styled from 'styled-components';

import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  & > .ant-row {
    display: flex;
  }

  .trade-content-text {
    .label-wrapper {
      padding: 4px 0;
    }
  }

  .rune-diagram-wrapper {
    flex-grow: 1;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .rune-diagrams {
      display: flex;
      justify-content: space-around;
    }
    .rune-diagram-pool,
    .rune-diagram-market {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }
  }

  .bottom-nav-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;
