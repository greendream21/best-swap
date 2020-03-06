import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';
import TxInfo from './txInfo';
import { txData1, txData2, txData3, txData4 } from './data';

storiesOf('Components/Transaction/TxInfo', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <TxInfo data={txData1} />
        <TxInfo data={txData2} />
        <TxInfo data={txData3} />
        <TxInfo data={txData4} />
      </AppHolder>
    </ThemeProvider>
  );
});
