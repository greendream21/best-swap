import styled from 'styled-components';
import { palette } from 'styled-theme';

export const TokenInfoWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 90px;
  padding: 8px 12px 8px 16px;
  background: ${palette('background', 1)};
  box-shadow: 0px 1px 3px ${palette('gray', 0)};
  border-radius: 3px;

  &:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 90px;
    left: 0px;
    top: 0px;
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
    background: ${palette('gradient', 0)};
  }

  .label-wrapper {
    padding: 0;
  }
`;
