import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from 'components/uielements/button';
import ContentView from 'components/utility/contentView';

import { media, cleanTag } from 'helpers/styleHelper';

import { transition } from 'settings/style-util';

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
      margin-top: 10px;
      margin-bottom: 10px;
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

export const PopoverContent = styled.div`
  font-size: '11px';
  color: ${palette('primary', 0)};
`;

export const FeeParagraph = styled(Paragraph)`
  padding-top: 10px;
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

    margin-right: 0px;

    ${media.sm`
      margin-right: 20px;
    `}
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

export const SwapDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-left: 10px;

  .label-wrapper {
    padding: 2px 0;
  }
`;

export const LabelInfo = styled.div`
  display: flex;
  align-items: center;

  .label-wrapper {
    margin-right: 6px;
  }
`;

export const PopoverIcon = styled(InfoCircleOutlined)`
  color: ${palette('primary', 0)};
  margin: 0 10px;
`;

export const InverseButton = styled(Button)`
  &.ant-btn {
    padding: 0 2px;
    min-width: 35px !important;
  }
`;
