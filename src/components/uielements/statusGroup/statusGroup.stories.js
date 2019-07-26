import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { Input } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import StatusGroup from './statusGroup';
import { stats } from './data';

storiesOf('Components/StatusGroup', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <StatusGroup title="users" status={stats.users} />
        <StatusGroup title="transactions" status={stats.transactions} />
        <StatusGroup title="pools" status={stats.pools} />
        <StatusGroup title="stakers" status={stats.stakers} />
      </AppHolder>
    </ThemeProvider>
  );
});
