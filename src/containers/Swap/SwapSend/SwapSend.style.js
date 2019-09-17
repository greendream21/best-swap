import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';
import { media, cleanTag } from '../../../helpers/styleHelper';

export const SwapAssetCard = styled.div`
  display: flex;
  flex-direction: column;

  ${media.md`
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 0;
  `}
`;

export const ArrowImage = styled.img`
  transform: rotate(90deg);
  ${media.md`
    transform: rotate(0);
  `}
`;

const BaseArrowContainer = cleanTag('div', ['rotate', 'showFrom', 'hideFrom']);
export const ArrowContainer = styled(BaseArrowContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ContentWrapper = styled(ContentView)`
  padding: 0;

  .ant-row {
    display: flex;
    flex-grow: 1;
    ${media.xs`
      flex-direction: column;
    `}
    ${media.sm`
      flex-direction: row;
    `}
  }

  .swap-detail-panel {
    display: flex;
    flex-direction: column;
    padding: 20px 20px !important;

    ${media.lg`
      border-right: 1px solid ${palette('border', 0)};
    `}

    .swap-type-selector {
      display: flex;
      justify-content: space-between;

      .btn-wrapper {
        width: calc(50% - 10px);
      }
    }

    .recipient-form {
      display: flex;
      padding-top: 20px;

      .label-wrapper {
        width: 130px;
        padding-top: 14px;
      }

      .ant-form-item {
        flex-grow: 1;
        height: 60px;
        .ant-form-explain {
          font-size: 12px;
        }
      }

      .ant-form-item-control-wrapper {
        width: 100%;
      }
    }

    .drag-confirm-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
  }

  .swap-token-panel {
    display: flex;
    flex-direction: column;
    padding: 20px 20px !important;

    .token-search-input {
      margin: 10px 0;
    }

    .coinList-wrapper {
      flex-grow: 1;
      ${media.xs`
        height: 300px;
      `}
      ${media.sm`
        height: 0;
      `}
      .coinList-row {
        padding: 0;
      }
    }
  }
`;

export const SwapModal = styled(Modal)`
  &.ant-modal {
    width: 700px !important;

    .ant-modal-body {
      height: 320px !important;
    }
  }
`;

export const SwapModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .coinData-wrapper {
    padding-left: 0;
    padding-bottom: 4px;
  }

  .status-wrapper {
    .status-title {
      padding-top: 0;
    }
    .status-value {
      padding-bottom: 0;
    }
  }

  .swapmodal-content {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .left-container {
      display: flex;
      flex-direction: column;
    }

    .center-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .right-container {
      display: flex;
      flex-direction: column;

      .expected-status {
        display: flex;

        .status-item {
          display: flex;
          flex-direction: column;
          padding-right: 8px;

          .price-label {
            padding-top: 4px;
            padding-bottom: 0;
          }
        }
      }
    }
  }

  .swap-info-wrapper {
    margin-top: 10px;

    .tx-label {
      text-transform: uppercase;
      text-align: center;
    }

    .before-start-label {
      opacity: 0;
    }

    .hash-address {
      display: flex;
      align-items: center;

      .copy-btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px solid ${palette('primary', 0)};
        border-radius: 6px;
        padding: 1px 4px;
        margin-right: 6px;
        color: ${palette('primary', 0)};
        cursor: pointer;
      }

      .label-wrapper {
        width: 100%;
      }
    }
  }
`;

export const PrivateModal = styled(Modal)``;
