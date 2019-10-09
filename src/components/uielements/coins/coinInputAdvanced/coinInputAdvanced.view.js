import styled from 'styled-components';

import { Input } from 'antd';

export const CoinInputAdvancedView = styled(Input)`
  width: 100%;
  /* TODO: move these styles to a uielement */
  &.ant-input {
    border: none;
    padding: 0;
    &:focus {
      outline: none;
      border: none;
      box-shadow: none;
    }
  }
  &.ant-input.ant-input-disabled {
    background-color: #fff;
  }
`;
