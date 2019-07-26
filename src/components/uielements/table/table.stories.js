import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Table from './table';
import { dataSource, columns } from './data';

storiesOf('Components/Table', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Table dataSource={dataSource} columns={columns} />
      </AppHolder>
    </ThemeProvider>
  );
});
