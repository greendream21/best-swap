import styled from 'styled-components';
import { palette, size } from 'styled-theme';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: ${size('panelHeaderHeight', '10px')};
  margin-top: 3px;
  border-bottom: 3px solid ${palette('gray', 0)};

  .label-wrapper {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 2.5px;

    svg
      padding: 0 8px;
      font-size: 16px;
    }
  }
`;
