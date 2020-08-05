import React from 'react';
import { Row, Col } from 'antd';

import { StatsData } from '../../types/generated/midgard/api';
import { StyledStatistic } from './statBar.style';

type Props = {
  stats: StatsData;
  statsLoading?: boolean;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats } = props;
  const {
    totalStaked = '0',
    totalTx = '0',
    totalVolume = '0',
    totalUsers = '0',
    poolCount = '0',
    totalEarned = '0',
  } = stats;

  return (
    <Row gutter={[16, 16]}>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Liquidity"
          value={totalStaked}
          prefix="$"
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 4 }}
      >
        <StyledStatistic title="Total Volume" value={totalVolume} prefix="$" />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 4 }}
      >
        <StyledStatistic title="Total Users" value={totalUsers} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 4 }}
      >
        <StyledStatistic title="Total Transactions" value={totalTx} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 4 }}
      >
        <StyledStatistic title="Total Pools" value={poolCount} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 4 }}
      >
        <StyledStatistic title="Total Earned" value={totalEarned} prefix="$" />
      </Col>
    </Row>
  );
};

export default Statistics;
