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

    .trade-flow-wrapper {
      width: 400px;
      padding: 30px 0;

      .center-text {
        display: flex;
        justify-content: center;
        align-items: center;
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

      .trade-flow-diagram {
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

    .trade-play-wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 10px 20px;

      .trade-diagram {
        display: flex;
        flex-grow: 1;
        justify-content: center;
        width: 500px;

        .market-diagram-wrapper {
          padding: 30px 0;

          .trade-flow-diagram {
            padding-top: 50px;
            padding-bottom: 23px;
          }
        }
      }

      .token-receiver-tooltip {
        margin-left: auto;
      }

      .slider-wrapper {
        width: 145px;
      }

      .payout-price-label {
        display: flex;
        justify-content: flex-end;
        padding-top: 0px;
      }
    }
  }

  .bottom-nav-button {
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
