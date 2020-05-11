import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { Row } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import ThemeSwitch from './themeSwitch';

storiesOf('Components/ThemeSwitch', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Row>
          <ThemeSwitch />
        </Row>
      </AppHolder>
    </ThemeProvider>
  );
});
