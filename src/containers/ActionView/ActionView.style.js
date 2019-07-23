import styled from 'styled-components';
import { palette, size, key } from 'styled-theme';

import ViewPanel from '../../components/viewPanel';

export const ActionViewWrapper = styled(ViewPanel)``;

export const HeaderAction = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${key('sizes.font.label', '11px')};
  font-weight: bold;
  color: ${palette('primary', 0)};
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
