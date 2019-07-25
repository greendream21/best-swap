import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { Input } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import StatusGroup from './statusGroup';
import { data } from './data';

storiesOf('Components/Label', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <StatusGroup title="users" status={data.users} />
        <StatusGroup title="transactions" status={data.transactions} />
        <StatusGroup title="pools" status={data.pools} />
        <StatusGroup title="stakers" status={data.stakers} />
      </AppHolder>
    </ThemeProvider>
  );
});
