import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { Row } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';
import AddWallet from '.';


storiesOf('Components/AddWallet', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Row>
          <AddWallet />
        </Row>
      </AppHolder>
    </ThemeProvider>
  );
});
