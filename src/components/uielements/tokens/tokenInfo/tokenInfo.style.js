import styled from 'styled-components';
import { palette } from 'styled-theme';

export const TokenInfoWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100px;
  padding: 8px 12px 8px 16px;
  background: #fff;
  box-shadow: 0px 1px 3px rgba(47, 83, 151, 0.1);
  border-radius: 3px;

  &:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 100px;
    left: 0px;
    top: 0px;
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
    background: ${palette('primary', 0)};
  }

  .label-wrapper {
    padding: 0;
  }

  .tokenInfo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-transform: uppercase;

    .pool-label {
      color: ${palette('text', 8)};
    }
  }
`;
