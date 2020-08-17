import React, { useCallback } from 'react';
import { Row, Col } from 'antd';

import { StatsData } from '../../types/generated/midgard/api';
import { StyledStatistic } from './statBar.style';

type Props = {
  stats: StatsData;
  statsLoading?: boolean;
  basePrice: string;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, basePrice } = props;
  const price = Number(basePrice);

  const getUSDValue = useCallback(
    (val: string) => {
      return (Number(val) / 1e8 / price).toFixed(2);
    },
    [price],
  );

  return (
    <Row gutter={[16, 16]}>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Staked"
          value={getUSDValue(stats?.totalStaked ?? '0')}
          prefix="$"
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Volume"
          value={getUSDValue(stats?.totalVolume ?? '0')}
          prefix="$"
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Total Users" value={stats?.totalUsers ?? '0'} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Total Transactions" value={stats?.totalTx ?? '0'} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Total Pools" value={stats?.poolCount ?? '0'} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Earned"
          value={getUSDValue(stats?.totalEarned ?? '0')}
          prefix="$"
        />
      </Col>
    </Row>
  );
};

export default Statistics;
