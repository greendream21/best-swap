import { InputNumber } from 'antd';
import styled from 'styled-components';
import { palette, key } from 'styled-theme';

import { InputNumberWrapperColor, InputNumberWrapperSize } from './types';

const fontSettings = {
  small: {
    size: key('sizes.font.small', '10px'),
  },
  default: {
    size: key('sizes.font.normal', '11px'),
  },
  large: {
    size: key('sizes.font.normal', '12px'),
  },
};

const colors = {
  primary: palette('gradient', 0),
  success: palette('success', 0),
  warning: palette('warning', 0),
  error: palette('error', 0),
};

type InputNumberWrapperProps = {
  color: InputNumberWrapperColor;
  size: InputNumberWrapperSize;
};

export const InputNumberWrapper = styled(InputNumber)<InputNumberWrapperProps>`
  &.ant-input-number {
    font-size: ${props => fontSettings[props.size].size};
    letter-spacing: '0.5px';
    &:hover,
    &:focus {
      border-color: ${props => colors[props.color]};
      --antd-wave-shadow-color: ${props => colors[props.color]};
    }
  }
`;
