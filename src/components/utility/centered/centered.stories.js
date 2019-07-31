import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Label from '../../uielements/label';

import Centered from './centered';

storiesOf('Utility/Centered', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            background: 'gray',
          }}
        >
          <Centered>
            <Label size="big" weight="bold">
              1,000,000
            </Label>
            <Label size="big" weight="bold">
              :
            </Label>
            <Label size="big" weight="bold">
              200
            </Label>
          </Centered>
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
