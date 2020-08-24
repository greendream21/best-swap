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
    (val: string) => {
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

  const liqFee = `${stats?.values?.liqFee || '0'}`;
  const volume = `${stats?.volumeAT?.amount() || '0'}`;
  const transaction = `${(Number(poolInfo?.swappingTxCount) || 0) + (Number(poolInfo?.stakingTxCount) || 0)}`;
  const buyTx = `${poolInfo?.buyAssetCount || '0'}`;
  const sellTx = `${poolInfo?.sellAssetCount || '0'}`;
  const buyVolume: string = poolInfo?.buyVolume || '0';
  const sellVolume: string = poolInfo?.sellVolume || '0';
  const earned = `${bnOrZero(buyVolume).minus(bnOrZero(sellVolume))}`;
  const users = `${stats?.totalStakers || '0'}`;
  const roi = `${stats?.apr ?? '0'}`;

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
           value={liqFee}
           formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{liqFee}</span>;
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
              return <span>{getUSDValue(volume)}</span>;
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
           title="Total Users"
           formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{users}</span>;
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
           title="Total Earned"
           formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{getUSDValue(earned)}</span>;
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
           title="Total ROI"
           formatter={() => {
              if (loading) return <LabelLoader />;
              return <span>{roi}</span>;
            }}
           suffix="%"
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
           title="Buy Tx"
           formatter={() => {
             if (loading) return <LabelLoader />;
             return <span>{buyTx}</span>;
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
           title="Sell Tx"
           formatter={() => {
             if (loading) return <LabelLoader />;
             return <span>{sellTx}</span>;
           }}
         />
       </Col>
     </Row>
   </>
  );
};

export default Statistics;
