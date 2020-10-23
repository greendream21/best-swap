import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { bnOrZero } from '@thorchain/asgardex-util';

import { StatsData, NetworkInfo } from '../../types/generated/midgard';
import { RootState } from '../../redux/store';
import { StyledStatistic } from './StatisticsView.style';

import usePrice from '../../hooks/usePrice';

type Props = {
  stats: StatsData;
  networkInfo: NetworkInfo;
};

const StatisticsView: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, networkInfo } = props;

  const { getUSDPriceLabel } = usePrice();

  const bondingAPYLabel = bnOrZero(networkInfo?.bondingAPY)
    .multipliedBy(100)
    .toFixed(2);
  const liquidityAPYLabel = bnOrZero(networkInfo?.liquidityAPY)
    .multipliedBy(100)
    .toFixed(2);

  const statsData = React.useMemo(() => {
    return [
      {
        title: 'Total Pooled',
        value: getUSDPriceLabel(bnOrZero(stats?.totalStaked)),
      },
      {
        title: 'Total Depth',
        value: getUSDPriceLabel(bnOrZero(stats?.totalDepth)),
      },
      {
        title: 'Total Earned',
        value: getUSDPriceLabel(bnOrZero(stats?.totalEarned)),
      },
      {
        title: 'Total Volume',
        value: getUSDPriceLabel(bnOrZero(stats?.totalVolume)),
      },
      {
        title: '24HR Volume',
        value: getUSDPriceLabel(bnOrZero(stats?.totalVolume24hr)),
      },
      {
        title: 'Pool Count',
        value: stats?.poolCount ?? '0',
      },
      {
        title: 'Total Pooled Tx',
        value: stats?.totalStakeTx ?? '0',
      },
      {
        title: 'Total Tx',
        value: stats?.totalTx ?? '0',
      },
      {
        title: 'Daily Tx',
        value: stats?.dailyTx ?? '0',
      },
      {
        title: 'Monthly Tx',
        value: stats?.monthlyTx ?? '0',
      },
      {
        title: 'Total Users',
        value: stats?.totalUsers ?? '0',
      },
      {
        title: 'Daily Active Users',
        value: stats?.dailyActiveUsers ?? '0',
      },
      {
        title: 'Monthly Active Users',
        value: stats?.monthlyActiveUsers ?? '0',
      },
      {
        title: 'Total Asset Buys',
        value: stats?.totalAssetBuys ?? '0',
      },
      {
        title: 'Total Asset Sells',
        value: stats?.totalAssetSells ?? '0',
      },
      {
        title: 'Total Withdraw Tx',
        value: stats?.totalWithdrawTx ?? '0',
      },
      {
        title: 'Bonding APY',
        value: `${bondingAPYLabel} %`,
      },
      {
        title: 'Liquidity APY',
        value: `${liquidityAPYLabel} %`,
      },
    ];
  }, [stats, bondingAPYLabel, liquidityAPYLabel, getUSDPriceLabel]);

  return (
    <Row gutter={[16, 16]}>
      {statsData.map((statProps, index) => {
        return (
          <Col
            key={index}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            xl={{ span: 4 }}
          >
            <StyledStatistic {...statProps} />
          </Col>
        );
      })}
    </Row>
  );
};

export default connect((state: RootState) => ({
  stats: state.Midgard.stats,
  networkInfo: state.Midgard.networkInfo,
}))(StatisticsView);
