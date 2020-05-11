import styled from 'styled-components';
import { palette, size, key } from 'styled-theme';

import ViewPanel from '../../components/viewPanel';
import { media } from '../../helpers/styleHelper';

export const ActionViewWrapper = styled(ViewPanel)``;

export const HeaderAction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${key('sizes.font.label', '11px')};
  font-weight: bold;
  color: ${palette('gradient', 0)};
  text-transform: uppercase;
  letter-spacing: 2.5px;
  cursor: pointer;

  .header-action-text {
    width: 110px;
    text-align: center;
  }
  img {
    width: ${size('icon', '16px')};
    height: ${size('icon', '16px')};
  }
`;

export const BackLink = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px !important;
  ${media.sm`
    margin-bottom: 20px !important;
  `}
  cursor: pointer;

  svg {
    margin-right: 6px;
    font-size: 22px;
    font-weight: bold;
    color: ${palette('primary', 0)};
  }

  span {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${palette('primary', 0)};
  }
`;
