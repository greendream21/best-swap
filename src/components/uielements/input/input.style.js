import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import { Input } from 'antd';

const fontSettings = {
  small: {
    size: key('sizes.font.small', '10px'),
    spacing: '0.5px',
  },
  normal: {
    size: key('sizes.font.normal', '11px'),
    spacing: '0.5px',
  },
  big: {
    size: key('sizes.font.normal', '12px'),
    spacing: '0.5px',
  },
};

const sizes = {
  small: '20px',
  normal: '25px',
  big: '32px',
};

const colors = {
  primary: palette('primary', 0),
  success: palette('success', 0),
  warning: palette('warning', 0),
  error: palette('error', 0),
};

export const InputWrapper = styled(Input)`
  &.ant-input-affix-wrapper,
  &.ant-input {
    height: ${props => sizes[props.sizevalue]};
    font-size: ${props => fontSettings[props.sizevalue].size};
    letter-spacing: ${props => fontSettings[props.sizevalue].spacing};
    ${props => props.typevalue === 'ghost' && 'border: none;'};
    ${props => props.typevalue === 'ghost' && 'background: #F0F3F7;'};

    border: 1px solid ${palette('gray', 0)};
    background: ${palette('background', 1)};
    color: ${palette('text', 0)};
    input,
    input:-internal-autofill-selected {
      color: ${palette('text', 0)};
      background: ${palette('background', 1)};
    }

    &:hover,
    &:focus {
      border-color: ${props => colors[props.color]};
      --antd-wave-shadow-color: ${props => colors[props.color]};
      box-shadow: ${props =>
        props.typevalue === 'ghost'
          ? 'none'
          : '0 0 0 2px ' + colors[props.color]};
    }
  }
`;
