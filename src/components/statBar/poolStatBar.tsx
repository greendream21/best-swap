import React from 'react';

import { bnOrZero } from '@thorchain/asgardex-util';
import { Row, Col } from 'antd';

import usePrice from 'hooks/usePrice';

import { PoolData } from 'helpers/utils/types';

import { PoolDetail } from 'types/generated/midgard';

import LabelLoader from '../utility/loaders/label';
import { StyledStatistic } from './statBar.style';

type Props = {
  stats: PoolData;
  loading?: boolean;
  poolInfo: PoolDetail;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, poolInfo, loading } = props;

  const { getReducedPriceLabel } = usePrice();

  const liquidityValue = getReducedPriceLabel(bnOrZero(poolInfo?.poolDepth), 0);

  const volume24 = getReducedPriceLabel(bnOrZero(poolInfo?.poolVolume24hr), 0);
  const transaction = `${(Number(poolInfo?.swappingTxCount) || 0) +
    (Number(poolInfo?.stakingTxCount) || 0)}`;

  /** pool earning = poolEarned * runePrice */
  const earning = getReducedPriceLabel(bnOrZero(poolInfo?.poolEarned), 0);

  const totalStakers = `${stats?.totalStakers ?? '0'}`;
  const totalSwaps = `${poolInfo?.swappingTxCount ?? '0'}`;

  const poolAPY = bnOrZero(poolInfo?.poolAPY);
  const poolAPYLabel = `${poolAPY.multipliedBy(100).toFixed(2)} %`;

  const totalPoolFee = getReducedPriceLabel(
    bnOrZero(poolInfo?.poolFeesTotal),
    0,
  );

  const poolStats = React.useMemo(
    () => [
      {
        title: 'Total Liquidity',
        value: liquidityValue,
      },
      {
        title: '24H Volume',
        value: volume24,
      },
      {
        title: 'Total Earning',
        value: earning,
      },
      {
        title: 'Total Fee',
        value: totalPoolFee,
      },
      {
        title: 'Total Members',
        value: totalStakers,
      },
      {
        title: 'Total Swaps',
        value: totalSwaps,
      },
      {
        title: 'Total Transactions',
        value: transaction,
      },
      {
        title: 'APY',
        value: poolAPYLabel,
      },
    ],
    [
      liquidityValue,
      earning,
      volume24,
      totalStakers,
      totalSwaps,
      transaction,
      poolAPYLabel,
      totalPoolFee,
    ],
  );

  return (
    <>
      <Row gutter={[16, 16]}>
        {poolStats.map((statsProp, index) => (
          <Col
            key={index}
            xs={{ span: 12 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
          >
            <StyledStatistic
              title={statsProp.title}
              formatter={() => {
                if (loading) return <LabelLoader />;
                return <span>{statsProp.value}</span>;
              }}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Statistics;
