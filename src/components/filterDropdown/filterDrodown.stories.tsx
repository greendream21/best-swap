import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../AppStyle';
import { defaultTheme } from '../../settings';
import FilterDropdown from './filterDropdown';
import { TxDetailsTypeEnum } from '../../types/generated/midgard';

storiesOf('Components/FilterDropdown', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <FilterDropdown
          onClick={key => console.log(key)}
          value={TxDetailsTypeEnum.Swap}
        />
      </AppHolder>
    </ThemeProvider>
  );
});
