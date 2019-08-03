import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import InputForm from './inputForm';

storiesOf('Components/InputForm', module).add('default', () => {
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
          <InputForm title="Add earnings:" type="rune" />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
