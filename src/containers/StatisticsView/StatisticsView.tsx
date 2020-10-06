import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { bnOrZero } from '@thorchain/asgardex-util';
import { baseAmount, formatBaseAsTokenAmount } from '@thorchain/asgardex-token';

import { StatsData } from '../../types/generated/midgard';
import { getTickerFormat } from '../../helpers/stringHelper';
import { RootState } from '../../redux/store';
import { AssetDetailMap } from '../../redux/midgard/types';
import { StyledStatistic } from './StatisticsView.style';

type Props = {
  assets: AssetDetailMap;
  stats: StatsData;
};

const StatisticsView: React.FC<Props> = (props: Props): JSX.Element => {
  const { assets, stats } = props;

  const busdToken = Object.keys(assets).find(
    item => getTickerFormat(item) === 'busd',
  );
  const busdPrice = busdToken ? assets[busdToken]?.priceRune : 'RUNE';

  const getUSDValue = useCallback(
    (val: string) => {
      const price = busdPrice === 'RUNE' ? 1 : Number(busdPrice);
      const bnValue = bnOrZero(val).dividedBy(price);
      const amount = baseAmount(bnValue);
      return formatBaseAsTokenAmount(amount, 0);
    },
    [busdPrice],
  );

  const getPrefix = useCallback(() => {
    return busdPrice === 'RUNE' ? 'ᚱ' : '$';
  }, [busdPrice]);

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
          title="Total Added Liquidity"
          value={getUSDValue(stats?.totalStaked ?? '0')}
          prefix={getPrefix()}
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
          title="Total Added Tx"
          value={stats?.totalStakeTx ?? '0'}
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
          title="Total Earned"
          value={getUSDValue(stats?.totalEarned ?? '0')}
          prefix={getPrefix()}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Total Tx" value={stats?.totalTx ?? '0'} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Total Depth"
          value={getUSDValue(stats?.totalDepth ?? '0')}
          prefix={getPrefix()}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Total Users" value={stats?.totalUsers} />
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
          prefix={getPrefix()}
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
          title="24HR Volume"
          value={getUSDValue(stats?.totalVolume24hr ?? '0')}
          prefix={getPrefix()}
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
          title="Total Asset Buys"
          value={stats?.totalAssetBuys ?? '0'}
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
          title="Total Asset Sells"
          value={stats?.totalAssetSells ?? '0'}
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
          title="Total Withdraw Tx"
          value={stats?.totalWithdrawTx ?? '0'}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Pool Count" value={stats?.poolCount ?? '0'} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Daily Active Users"
          value={stats?.dailyActiveUsers ?? '0'}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Daily Tx" value={stats?.dailyTx ?? '0'} />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic
          title="Monthly Active Users"
          value={stats?.monthlyActiveUsers}
        />
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 8 }}
        xl={{ span: 4 }}
      >
        <StyledStatistic title="Monthly Tx" value={stats?.monthlyTx} />
      </Col>
    </Row>
  );
};

export default connect((state: RootState) => ({
  stats: state.Midgard.stats,
  assets: state.Midgard.assets,
}))(StatisticsView);
