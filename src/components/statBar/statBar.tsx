import React from 'react';
import { Row, Col, Skeleton } from 'antd';

import { StatsData } from '../../types/generated/midgard/api';
import { StyledCard, StyledStatistic } from './statBar.style';

type Props = {
  stats: StatsData;
  statsLoading?: boolean;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, statsLoading = false } = props;
  const {
    totalStaked = '0',
    totalTx = '0',
    totalVolume = '0',
    totalVolume24hr = '0',
  } = stats;

  return (
    <StyledCard title="Statistics" bordered>
      <Skeleton loading={statsLoading}>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
          >
            <StyledStatistic title="Total Staked" value={totalStaked} />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
          >
            <StyledStatistic title="Total Tx" value={totalTx} />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
          >
            <StyledStatistic title="Total Volume" value={totalVolume} />
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
          >
            <StyledStatistic title="24Hr Volume" value={totalVolume24hr} />
          </Col>
        </Row>
      </Skeleton>
    </StyledCard>
  );
};

export default Statistics;
