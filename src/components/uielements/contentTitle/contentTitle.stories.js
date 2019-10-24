import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import ContentTitle from './contentTitle';

storiesOf('Components/ContentTitle', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <ContentTitle>you are swapping</ContentTitle>
      </AppHolder>
    </ThemeProvider>
  );
});
