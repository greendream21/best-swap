import React from 'react';
import { Row, Col } from 'antd';

import { bnOrZero } from '@thorchain/asgardex-util';

import LabelLoader from '../utility/loaders/label';
import { PoolData } from '../../helpers/utils/types';
import { StyledStatistic } from './statBar.style';
import { PoolDetail } from '../../types/generated/midgard';

import usePrice from '../../hooks/usePrice';

type Props = {
  stats: PoolData;
  loading?: boolean;
  poolInfo: PoolDetail;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, poolInfo, loading } = props;

  const { getReducedPriceLabel } = usePrice();

  const liquidityValue = getReducedPriceLabel(bnOrZero(poolInfo?.poolDepth), 0);

  const volume = getReducedPriceLabel(bnOrZero(poolInfo?.poolVolume), 0);
  const volume24 = getReducedPriceLabel(bnOrZero(poolInfo?.poolVolume24hr), 0);
  const transaction = `${(Number(poolInfo?.swappingTxCount) || 0) +
    (Number(poolInfo?.stakingTxCount) || 0)}`;

  /** pool earning = poolEarned * runePrice */
  const earning = getReducedPriceLabel(bnOrZero(poolInfo?.poolEarned), 0);

  const totalStakers = `${stats?.totalStakers ?? '0'}`;
  const totalSwaps = `${poolInfo?.swappingTxCount ?? '0'}`;

  const poolAPY = bnOrZero(poolInfo?.poolAPY);
  const poolAPYLabel = poolAPY.multipliedBy(100).toFixed(2);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="Total Liquidity"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{liquidityValue}</span>;
            }}
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="Total Earnings"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{earning}</span>;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="Total Volume"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{volume}</span>;
            }}
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="24H Volume"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{volume24}</span>;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="Total Members"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{totalStakers}</span>;
            }}
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="Total Swaps"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{totalSwaps}</span>;
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="Total Transactions"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{transaction}</span>;
            }}
          />
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <StyledStatistic
            title="APY"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{poolAPYLabel}</span>;
            }}
            suffix={loading ? '' : '%'}
          />
        </Col>
      </Row>
    </>
  );
};

export default Statistics;
