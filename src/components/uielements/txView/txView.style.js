import styled from 'styled-components';
import { palette } from 'styled-theme';

export const TxViewWrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;

  .timerchart-icon {
    position: absolute;
    top: 0px;
    left: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;

    .confirm-icon {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background-color: ${palette('primary', 0)};

      i {
        color: #fff;
        font-size: 20px;
        padding: 10px;
      }
    }
  }

  .timerchart-circular-progressbar {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    &.hide {
      visibility: hidden;
    }
  }
`;
