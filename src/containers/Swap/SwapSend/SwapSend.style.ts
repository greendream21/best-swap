import styled from 'styled-components';
import { Popover } from 'antd';
import Icon from '@ant-design/icons';
import { palette } from 'styled-theme';
import Paragraph from 'antd/lib/typography/Paragraph';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';
import { media, cleanTag } from '../../../helpers/styleHelper';
import { transition } from '../../../settings/style-util';

export const SwapAssetCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
  max-width: 600px;

  .swaptool-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    display: none;
  }

  .drag-confirm-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
  }

  ${media.lg`
    max-width: 800px;
  `}

  .swap-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 20px;
    align-items: center;
    margin: 0px auto;
    .desktop-view {
      display: none;
      ${media.lg`
        display: block;
      `}
    }
    ${media.sm`
      margin-top: 40px;
      margin-bottom: 20px;
    `}
  }
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

  .swap-arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 54px;
    height: 40px;
    border: 1px solid ${palette('gradient', 0)};
    border-radius: 5px;
    cursor: pointer;

    svg {
      color: ${palette('gradient', 0)};
      ${transition()}
    }

    &:hover {
      svg {
        color: ${palette('text', 3)};
      }
    }
  }
`;

export const ContentWrapper = styled(ContentView)`
  padding: 18px 0;
  ${media.sm`
    padding: 48px 0;
  `}

  .swap-detail-panel {
    display: flex;
    flex-direction: column;
    padding: 20px 20px !important;

    .swap-type-selector {
      display: flex;
      justify-content: space-between;

      .btn-wrapper {
        width: calc(50% - 10px);
      }
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

export const CardFormHolder = styled.div`
  padding-top: 10px;
  margin: 10px 0;

  .addressInput-wrapper {
    margin-left: 4px;
  }

  &.slip-protection {
    .ant-popover-arrow {
      border-bottom: none;
      border-left: none;
    }

    .slip-input {
      width: 50px;
      margin: 0 8px;
    }

    button {
      width: 21px;
      height: 21px;
      min-width: 0px;
      padding-top: 2px;
      padding-left: 4px;
      padding-right: 4px;
      border-radius: 50%;

      svg {
        font-size: 15px;
      }
    }
  }
`;

export const PopoverContainer = styled(Popover)``;

export const CardForm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > * {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

export const CardFormItem = styled.div`
  flex-grow: 1;
`;

export const CardFormItemError = styled.div`
  font-size: 12px;
  color: ${palette('text', 0)};
  padding-top: 6px;
`;

export const CardFormItemCloseButton = styled(Icon).attrs({
  type: 'close',
})``;

export const SwapModal = styled(Modal)`
  &.ant-modal {
    width: 420px !important;

    .ant-modal-body {
      padding: 0px;
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
    margin-left: 14px;
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
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 30px 0;
    border-bottom: 1px solid ${palette('gray', 0)};

    .timer-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 30px;
    }

    .coin-data-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      .coin-data-container {
        display: flex;
        flex-direction: column;

        .coinData-wrapper {
          &:first-child {
            padding-bottom: 20px;
          }
        }
      }
    }
  }

  .swap-info-wrapper {
    display: flex;
    flex-direction: column;

    padding: 20px 0;
    .hash-address {
      display: flex;
      align-items: center;

      .copy-btn-wrapper {
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
          margin-top: 24px;
        }

        a.view-tx {
          margin-top: 24px;
          color: ${palette('primary', 0)};
        }
      }

      .label-wrapper {
        width: 100%;
      }
    }
  }
`;

export const SwapStatusPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto 10px;

  .slip-ratio-labels {
    margin-left: 18px;
  }

  svg {
    transform: rotate(-90deg);
    font-size: 24px;
    color: ${palette('primary', 0)};
    cursor: pointer;

    &:hover {
      font-size: 26px;
    }
  }
`;

export const PopoverContent = styled.div`
  font-size: '11px';
  color: ${palette('primary', 0)};
`;

export const FeeParagraph = styled(Paragraph)`
  padding-top: 10px;
  text-align: center;
  & > * {
    color: ${palette('text', 2)};
  }
`;

export const SliderSwapWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  align-items: center;
  margin-top: 20px;
  padding-bottom: 20px;
  height: 80px;
  .slider {
    flex-grow: 1;
    align-self: baseline;
  }
  .swap-wrapper {
    width: 60px;
    text-align: center;
    .swap-outlined {
      font-size: 22px;
      transform: rotate(90deg);
      color: ${palette('success', 0)};
    }
  }
  ${media.sm`
    .swap-wrapper {
      width: 170px;
    }  
  `}
`;
