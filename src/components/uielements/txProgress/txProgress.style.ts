import styled from 'styled-components';

export const TxProgressWrapper = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
  cursor: pointer;

  &.disabled {
    opacity: 0.4;
  }

  .timerchart-icon {
    position: absolute;
    top: 2px;
    left: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 22px;
    height: 22px;

    svg {
      width: 22px;
      height: 22px;
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
