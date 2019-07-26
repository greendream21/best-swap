import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Collapse from './collapse';
import { faqs } from './data';

storiesOf('Components/Label', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Collapse data={faqs} />
      </AppHolder>
    </ThemeProvider>
  );
});
