import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import { InputNumber } from 'antd';

const fontSettings = {
  small: {
    size: key('sizes.font.small', '10px'),
    spacing: '0.5px',
  },
  default: {
    size: key('sizes.font.normal', '11px'),
    spacing: '0.5px',
  },
  large: {
    size: key('sizes.font.normal', '12px'),
    spacing: '0.5px',
  },
};

const colors = {
  primary: palette('primary', 0),
  success: palette('success', 0),
  warning: palette('warning', 0),
  error: palette('error', 0),
};

export const InputNumberWrapper = styled(InputNumber)`
  &.ant-input-number {
    font-size: ${props => fontSettings[props.size].size};
    letter-spacing: ${props => fontSettings[props.size].spacing};
    &:hover,
    &:focus {
      border-color: ${props => colors[props.color]};
      --antd-wave-shadow-color: ${props => colors[props.color]};
    }
  }

  &.ant-input-number {
    height: 25px;
    .ant-input-number-input {
      position: relative;
      top: -4px;
      height: 25px;
    }
  }

  &.ant-input-number-sm {
    height: 20px;
    .ant-input-number-input {
      position: relative;
      top: -2px;
      height: 20px;
    }
  }

  &.ant-input-number-lg {
    height: 30px;
    .ant-input-number-input {
      position: relative;
      top: -6px;
      height: 30px;
    }
  }
`;
