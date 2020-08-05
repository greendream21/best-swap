import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Card, Statistic } from 'antd';

export const StyledCard = styled(Card)`
  border: none;

  .ant-card-head,
  .ant-card-body {
    background-color: ${palette('background', 1)};
  }

  .ant-card-head {
    border-bottom-color: ${palette('gray', 0)};

    .ant-card-head-wrapper {
      .ant-card-head-title {
        color: ${palette('text', 0)};
        text-transform: uppercase;
      }
    }
  }
`;

export const StyledStatistic = styled(Statistic)`
  text-transform: uppercase;

  .ant-statistic-title {
    color: ${palette('text', 1)};
  }

  .ant-statistic-content-value-int {
    color: ${palette('text', 0)};
  }
`;
