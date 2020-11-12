import React from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import { bnOrZero } from '@thorchain/asgardex-util';

import LabelLoader from '../utility/loaders/label';
import { StatsData, NetworkInfo } from '../../types/generated/midgard/api';
import { StyledStatistic } from './statBar.style';

import usePrice from '../../hooks/usePrice';

type Props = {
  stats: StatsData;
  networkInfo: NetworkInfo;
  loading?: boolean;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, networkInfo, loading } = props;
  const { getUSDPriceLabel } = usePrice();

  const bondingAPYLabel = bnOrZero(networkInfo?.bondingAPY)
    .multipliedBy(100)
    .toFixed(2);
  const liquidityAPYLabel = bnOrZero(networkInfo?.liquidityAPY)
    .multipliedBy(100)
    .toFixed(2);

  const poolStats = React.useMemo(
    () => [
      {
        title: 'Total Volume',
        value: getUSDPriceLabel(bnOrZero(stats?.totalVolume)),
      },
      {
        title: '24H Volume',
        value: getUSDPriceLabel(bnOrZero(stats?.totalVolume24hr)),
      },
      {
        title: 'Total Users',
        value: stats?.totalUsers ?? '0',
      },
      {
        title: 'Bonding APY',
        value: `${bondingAPYLabel} %`,
      },
      {
        title: 'Liquidity APY',
        value: `${liquidityAPYLabel} %`,
      },
      {
        title: 'Total Earned',
        value: getUSDPriceLabel(bnOrZero(stats?.totalEarned)),
      },
    ],
    [stats, bondingAPYLabel, liquidityAPYLabel, getUSDPriceLabel],
  );

  return (
    <Row gutter={[16, 16]}>
      {poolStats.map((statsProps, index) => (
        <Col
          key={index}
          xs={{ span: 12 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
          xl={{ span: 4 }}
        >
          <StyledStatistic
            title={statsProps.title}
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{statsProps.value}</span>;
            }}
          />
        </Col>
      ))}
    </Row>
  );
};

export default Statistics;
