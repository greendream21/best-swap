import styled from 'styled-components';

import ContentView from '../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  & > .ant-row {
    display: flex;
  }

  .share-placeholder-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
  }

  .placeholder-label {
    font-size: 14px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
`;
