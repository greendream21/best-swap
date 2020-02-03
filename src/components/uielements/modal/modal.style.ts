import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Modal } from 'antd';

export const ModalWrapper = styled(Modal)`
  text-transform: uppercase;
  .ant-modal-header {
    padding: 10px 14px;
    text-align: center;
    background: ${palette('primary', 0)};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    .ant-modal-title {
      color: #fff;
    }
  }
  .ant-modal-body {
    padding: 46px 32px;
  }
  .ant-modal-close {
    .ant-modal-close-x {
      width: 44px;
      height: 48px;
      line-height: 48px;
      color: #fff;
    }
  }
  .ant-modal-footer {
    height: 46px;
    padding: 0;
    & > div {
      display: flex;
      flex-direction: row;
      height: 100%;
    }
  }

  .ok-ant-btn,
  .cancel-ant-btn {
    flex-grow: 1;
    height: 100%;
    border: none;
    border-radius: 0px;
    &:first-child {
      border-right: 1px solid #d3dbe7;
    }
    &:hover,
    &:active,
    &:focus {
      color: ${palette('primary', 1)};
    }

    &.ant-btn-primary {
      background: #fff;
      color: ${palette('primary', 1)};
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
