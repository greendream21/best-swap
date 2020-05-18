import styled from 'styled-components';
import { palette } from 'styled-theme';
import { media } from '../../../helpers/styleHelper';

export const TxLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  font-size: 11px;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: ${palette('text', 0)};

  ${media.sm`
    height: 26px;
    width: 150px;
    font-size: 13px;
    letter-spacing: 1px;
  `}
  p {
    margin-right: 10px;
    ${media.sm`
      width: 100px;
      text-align: right;
      margin-right: 10px;
    `}
  }

  .tx-label-icon {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 20px;
    height: 20px;
    ${media.sm`
      width: 40px;
    `}
    svg {
      height: 20px;
      ${media.sm`
        height: auto;
      `}
    }
  }
`;
