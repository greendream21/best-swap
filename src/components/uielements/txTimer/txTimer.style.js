import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from '../../../settings/style-util';

export const TxTimerWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;

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
