import styled from 'styled-components';
import { palette } from 'styled-theme';

export const ContentWrapper = styled.div`
  display: flex;
  flex: auto;
  & > .ant-row {
    display: flex;
    flex: auto;
  }

  .intro-text {
    padding: 20px 20px !important;
    border-right: 1px solid ${palette('border', 0)};

    .label-wrapper {
      padding: 6px 0;
    }

    .try-btn {
      margin-top: 14px;
    }
  }

  .tutorial-content {
    display: flex;
    flex-direction: column;

    .tutorial-flow {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }

    .double-swap-flow-wrapper {
      display: flex;
      flex-direction: column;
      width: 720px;

      .centered-wrapper {
        height: 50px;
      }

      .double-swap-flow-row {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .swap-flow-diagram {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        padding: 20px 0;

        .reverse-image {
          transform: rotate(180deg);
        }
      }
    }

    .swap-flow-wrapper {
      width: 350px;
      padding: 0;

      .label-wrapper {
        &.header-label {
          padding-top: 0px;
          letter-spacing: 2px;
        }

        &.contains-tooltip {
          justify-content: space-between;
        }
      }

      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .swap-intro-wrapper {
      padding: 15px 20px;
    }
    .swap-play-wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 15px 20px;

      .token-swap-wrapper,
      .token-receive-wrapper {
        width: 200px;
      }

      .token-receiver-tooltip {
        margin-left: auto;
      }
    }
  }

  .bottom-nav-button {
    position: absolute;
    bottom: 0;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px;

    button {
      width: 130px;
    }
  }
`;
