import styled from 'styled-components';
import { palette } from 'styled-theme';
import { media } from '../../../helpers/styleHelper';

export const TxInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${media.sm`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  `}

  .txInfo-main-data,
  .txInfo-extra-data {
    display: flex;
    justify-content: flex-start;
  }

  .txInfo-extra-data {
    padding: 10px 0;
  }

  .tx-event-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    text-transform: uppercase;

    ${media.sm`
      font-size: 14px;
    `}
    &.left-margin {
      margin-left: 4px;
      ${media.sm`
        margin-left: 30px;
      `}
    }

    .tx-event-title {
      font-weight: 600;
      margin-right: 4px;
      ${media.sm`
        margin-right: 10px;
      `}
    }
  }
`;

export const Seperator = styled.div`
  width: 0px;
  height: 30px;
  margin: 0 6px;
  border-left: 1px solid ${palette('gray', 0)};
  ${media.sm`
    height: 40px;
    margin: 0 10px;
  `}
`;

export const Dash = styled.div`
  width: 0px;
  border-left: 1px solid ${palette('gray', 0)};
  height: 14px;
  margin: 0 10px;
  ${media.sm`
    height: 20px;
    margin: 0 20px;
  `}
`;
