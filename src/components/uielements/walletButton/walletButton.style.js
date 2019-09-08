import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import { Button } from 'antd';

export const ButtonWrapper = styled(Button)`
  &.ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    min-width: 140px;
    width: 140px;
    height: 30px;
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #fff;
    border-color: ${palette('primary', 0)};
    border-radius: 20px;
    background: ${palette('primary', 4)};
    text-transform: uppercase;

    &.focused,
    &:hover,
    &:active,
    &:focus {
      border-color: ${palette('success', 0)} !important;
      background: ${palette('primary', 4)} !important;
    }
  }
`;
