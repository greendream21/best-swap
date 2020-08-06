import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Statistic } from 'antd';

export const StyledStatistic = styled(Statistic)`
  background: ${palette('background', 0)};
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 4px;
  height: 79px;

  &:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 79px;
    left: 8px;
    top: 8px;
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
    background: ${palette('gradient', 0)};
  }

  .ant-statistic-title {
    color: ${palette('text', 1)};
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .ant-statistic-content {
    margin-top: 12px;
    display: flex;

    span {
      color: ${palette('text', 0)};
      font-family: 'Exo 2';
      font-size: 16px;
      font-weight: bold;
    }
  }
`;
