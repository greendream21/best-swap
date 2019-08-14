import styled from 'styled-components';
import { palette, size, key } from 'styled-theme';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: ${size('panelHeaderHeight', '10px')};
  padding: 0 ${key('sizes.gutter.horizontal', '30px')};
  margin-top: 3px;
  border-bottom: 3px solid ${palette('primary', 5)};

  .label-wrapper {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 2.5px;

    i {
      padding: 0 8px;
      font-size: 16px;
    }
  }
`;
