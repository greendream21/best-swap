import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Modal } from 'antd';

export const ModalWrapper = styled(Modal)`
  .ant-btn {
    &:hover,
    &:active,
    &:focus {
      color: ${palette('primary', 0)};
      border-color: ${palette('primary', 0)};
    }

    &.ant-btn-primary {
      color: #fff;
      background-color: ${palette('primary', 0)};
      border-color: ${palette('primary', 0)};
      &:hover,
      &:active,
      &:focus {
        background-color: ${palette('secondary', 0)};
        border-color: ${palette('secondary', 0)};
      }
    }
  }
`;
