import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Statistic } from 'antd';

export const StyledStatistic = styled(Statistic)`
  background: ${palette('background', 0)};
  text-transform: uppercase;
  padding: 10px 20px;

  .ant-statistic-title {
    color: ${palette('text', 1)};
    font-size: 14px;
  }

  .ant-statistic-content {
    span {
      color: ${palette('text', 0)};
      font-size: 16px;
      font-weight: bold;
    }
  }
`;
