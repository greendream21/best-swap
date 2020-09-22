import styled from 'styled-components';
import { palette } from 'styled-theme';
import { InfoCircleOutlined } from '@ant-design/icons';

export const PoolFilterWrapper = styled.div`
  display: flex;
  align-items: center;

  button {
    &:first-child {
      margin-right: 20px;
    }
  }
`;

export const PopoverContent = styled.div`
  z-index: 9999;
  width: 300px;
  font-size: '11px';
  color: ${palette('text', 0)};
`;

export const PopoverIcon = styled(InfoCircleOutlined)`
  color: ${palette('primary', 0)};
  margin: 0 10px;
`;
