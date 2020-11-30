import styled from 'styled-components';
import { palette } from 'styled-theme';

import { media } from 'helpers/styleHelper';

import Modal from '../../uielements/modal';

export const StyledModal = styled(Modal)`
  &.ant-modal {
    width: 420px !important;
    z-index: 999999;
    animation-duration: 550ms;
    transform-origin: calc(50vw + 50% + 1.5rem) -72px !important;

    .ant-modal-body {
      padding: 0px;
    }
  }
`;

export const ModalContent = styled.div`
  ${media.lg`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 30px 0;
    border-bottom: 1px solid ${palette('gray', 0)};

    .timer-container {
      ${media.lg`
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 30px;
      `}
    }

    .asset-data-container {
      display: flex;
      justify-content: center;
      align-items: center;

      .asset-pair {
        display: flex;
        flex-direction: column;

        .coinData-wrapper {
          padding-left: 0;
          padding-bottom: 4px;
          margin-left: 14px;
          &:first-child {
            padding-bottom: 20px;
          }
        }
      }
    }
  }

  .modal-info-container {
    padding: 20px 0;

    .modal-actions-container {
      display: flex;
      align-items: center;

      .modal-actions-col {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        border: 1px solid ${palette('gradient', 0)};
        border-radius: 6px;
        padding: 1px 4px;
        margin-right: 6px;
        margin-bottom: 16px;
        color: ${palette('gradient', 0)};
        cursor: pointer;

        .view-btn {
          width: 300px;
          height: 40px;
          margin: 24px 0;
        }
      }

      .label-wrapper {
        width: 100%;
      }
    }
  }
`;
