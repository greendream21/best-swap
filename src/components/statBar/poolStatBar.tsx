import React, { useCallback } from 'react';
import { Row, Col } from 'antd';

import { PoolData } from '../../helpers/utils/types';
import { StyledStatistic } from './statBar.style';
import { PoolDetail } from '../../types/generated/midgard';

type Props = {
  stats: PoolData;
  statsLoading?: boolean;
  poolInfo: PoolDetail;
  basePrice: string;
};

const Statistics: React.FC<Props> = (props: Props): JSX.Element => {
  const { stats, poolInfo, basePrice } = props;
  const price = Number(basePrice);

  const getUSDValue = useCallback(
    (val: string) => {
      return (Number(val) / 1e8 / price).toFixed(2);
    },
    [price],
  );

  const liqFee = `${stats?.values?.liqFee || '0'}`;
  const volume = `${stats?.volumeAT?.amount() || '0'}`;
  const transaction = `${stats?.transaction?.amount() || '0'}`;
  const buyTx = `${poolInfo?.buyTxAverage || '0'}`;
  const sellTx = `${poolInfo?.sellTxAverage || '0'}`;
  const earned = `${(Number(poolInfo?.sellVolume) - Number(poolInfo?.buyVolume)) || '0'}`;
  const users = `${poolInfo?.swappersCount || '0'}`;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <StyledStatistic
            title="Total Liquidity"
            value={liqFee}
            prefix="$"
          />
        </Col>
        <Col span={12}>
          <StyledStatistic
            title="Total Volume"
            value={getUSDValue(volume)}
            prefix="$"
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <StyledStatistic title="Total Users" value={users ?? '0'} />
        </Col>
        <Col span={12}>
          <StyledStatistic title="Total Transactions" value={getUSDValue(transaction) ?? '0'} />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <StyledStatistic title="Total Earned" value={getUSDValue(earned) ?? '0'} prefix="$" />
        </Col>
        <Col span={12}>
          <StyledStatistic
            title="Total ROI"
            value={`${stats?.roiAT ?? '0'}`}
            suffix="%"
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <StyledStatistic
            title="Buy Tx"
            value={getUSDValue(buyTx) ?? '0'}
            prefix="$"
          />
        </Col>
        <Col span={12}>
          <StyledStatistic
            title="Sell Tx"
            value={getUSDValue(sellTx) ?? '0'}
            prefix="$"
          />
        </Col>
      </Row>
    </>
  );
};

export default Statistics;
