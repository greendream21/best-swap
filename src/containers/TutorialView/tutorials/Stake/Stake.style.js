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

    .stake-flow-wrapper {
      width: 400px;
      padding: 0;

      .center-text {
        display: flex;
        justify-content: center;
        align-items: center;

        &.description-label {
          .label-wrapper {
            padding: 0;
          }
        }
      }

      .centered-wrapper {
        height: 50px;
      }

      .contains-tooltip {
        display: flex;
        justify-content: space-between;
      }

      .label-wrapper {
        &.header-label {
          padding-top: 0px;
          letter-spacing: 2px;
        }
      }

      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .stake-flow-diagram {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        padding: 20px 0;

        .reverse-image {
          transform: rotate(180deg);
        }

        .arrow-image {
          display: flex;
          justify-content: flex-end;
          width: 350px;
          padding-right: 20px;

          &.contains-tooltip {
            justify-content: space-between;
            padding-left: 20px;
            padding-right: 0px;
          }
        }
      }
    }

    .stake-intro-wrapper {
      padding: 15px 20px;
    }
    .stake-play-wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 15px 20px;

      .token-receiver-tooltip {
        margin-left: auto;
      }

      .token-stake-wrapper {
        width: 200px;
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
