import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Modal } from 'antd';

export const ModalWrapper = styled(Modal)`
  .ant-modal-header {
    padding: 10px 14px;
    text-align: center;
    background: ${palette('background', 6)};
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
  .ant-modal-close {
    .ant-modal-close-x {
      width: 44px;
      height: 48px;
      line-height: 48px;
    }
  }
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
