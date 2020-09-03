import React, { useCallback } from 'react';
import { Row, Col } from 'antd';

import { bnOrZero } from '@thorchain/asgardex-util';
import { baseAmount, formatBaseAsTokenAmount } from '@thorchain/asgardex-token';

import LabelLoader from '../utility/loaders/label';
import { PoolData } from '../../helpers/utils/types';
import { StyledStatistic } from './statBar.style';
import { PoolDetail } from '../../types/generated/midgard';

type Props = {
  stats: PoolData;
  loading?: boolean;
  poolInfo: PoolDetail;
  basePrice: string;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, poolInfo, basePrice, loading } = props;
  const price = Number(basePrice);

  const getUSDValue = useCallback(
    (val: string | number) => {
      const bnValue = bnOrZero(val).dividedBy(price);
      const amount = baseAmount(bnValue);
      return formatBaseAsTokenAmount(amount, 0);
    },
    [price],
  );

  const getPrefix = useCallback(() => {
    if (loading) return '';
    if (basePrice === 'RUNE') return 'ᚱ';
    return '$';
  }, [loading, basePrice]);

  const liquidityValue = getUSDValue(poolInfo?.poolDepth ?? 0);

  const volume = getUSDValue(`${stats?.volumeAT?.amount() || '0'}`);
  const transaction = `${(Number(poolInfo?.swappingTxCount) || 0) +
    (Number(poolInfo?.stakingTxCount) || 0)}`;

  /** pool earning = poolROI * poolStakedTotal */
  const poolROI = bnOrZero(poolInfo?.poolROI);
  const poolStakedTotal = bnOrZero(poolInfo?.poolStakedTotal);
  const earning = getUSDValue(poolStakedTotal.multipliedBy(poolROI).toString());

  const totalStakers = `${stats?.totalStakers ?? '0'}`;
  const totalSwaps = `${poolInfo?.swappingTxCount ?? '0'}`;
  const apy = stats?.apy;

  const roiATResult = Number(poolInfo?.poolROI ?? 0);
  const apr = Number((roiATResult * 100).toFixed(2));

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
            prefix={getPrefix()}
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
            title="Total Volume"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{volume}</span>;
            }}
            prefix={getPrefix()}
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
            title="Total Stakers"
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
            title="Total Earnings"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{earning}</span>;
            }}
            prefix={getPrefix()}
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
            title="Total Transactions"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{transaction}</span>;
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
            title="APY"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{apy}</span>;
            }}
            suffix={loading ? '' : '%'}
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
            title="APR"
            formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{apr}</span>;
            }}
            suffix={loading ? '' : '%'}
          />
        </Col>
      </Row>
    </>
  );
};

export default Statistics;
