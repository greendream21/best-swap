import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { Popover, Form } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import styled from 'styled-components';
import { palette } from 'styled-theme';


import UnstyledInput from 'components/uielements/input';
import Label from 'components/uielements/label';
import TokenSelect from 'components/uielements/tokens/tokenSelect';
import ContentView from 'components/utility/contentView';

import { media, cleanTag } from 'helpers/styleHelper';

import { transition } from 'settings/style-util';

export const SwapAssetCard = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  background: ${palette('background', 0)};
  padding-bottom: 20px;

  border-radius: 14px;
  border: 1px solid ${palette('gray', 0)};

  .drag-confirm-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }


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
  background: transparent;

  padding-bottom: 18px;
  ${media.sm`
    padding-bottom: 40px;
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

export const PopoverContainer = styled(Popover)``;

export const CardForm = styled(Form)`
  display: flex;
  flex-direction: row;
  align-items: center;

  width: 100%;
`;

export const CardFormItem = styled(Form.Item)`
  flex-grow: 1;
`;

export const CardFormItemError = styled.div`
  font-size: 12px;
  color: ${palette('error', 0)};
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
  align-items: center;
  margin-top: 20px;
  padding-left: 10px;
  padding-bottom: 8px;
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
    display: flex;
    justify-content: center;
    align-items: center;

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

export const Input = styled(UnstyledInput)`
  &.ant-input {
    width: 100%;
  }
`;

export const FormLabel = styled(Label)`
  padding-bottom: 4px;
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const PoolSelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const PoolSelectLabelWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 336px;
`;

export const TokenMenu = styled(TokenSelect)`
  width: 170px;
`;

export const SendTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;

  .label-wrapper {
    margin-right: 4px;
  }

  .btn-wrapper {
    margin-right: 8px;
  }
`;

export const WithdrawPercent = styled.div`
  display: flex;
  align-items: center;

  width: 50px;
`;

export const AlertWrapper = styled.div`
  padding-bottom: 8px;

  .ant-alert {
    border-radius: 4px;
    background: rgba(255, 251, 229, 0.1);

    .ant-alert-message {
      color: ${palette('text', 0)};
    }
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  padding: 0 20px;

  .btn-wrapper {
    border-radius: 8px;
    min-width: 30px;
  }
`;
