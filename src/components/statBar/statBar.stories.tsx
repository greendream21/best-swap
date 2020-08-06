import React from 'react';
import { storiesOf } from '@storybook/react';

import Statistics from './statBar';

const stats = {
  dailyActiveUsers: '7',
  dailyTx: '5287',
  monthlyActiveUsers: '67',
  monthlyTx: '33451',
  poolCount: '11',
  totalAssetBuys: '5813',
  totalAssetSells: '10606',
  totalDepth: '20337469495222',
  totalEarned: '68783345439',
  totalStakeTx: '227',
  totalStaked: '44118836146946',
  totalTx: '33451',
  totalUsers: '67',
  totalVolume: '20857643066470',
  totalVolume24hr: '1806447622139',
  totalWithdrawTx: '45',
};

storiesOf('Components/Statistics', module).add('default', () => {
  return <Statistics stats={stats} statsLoading={false} basePrice='1' />;
});
