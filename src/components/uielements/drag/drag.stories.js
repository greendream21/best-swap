import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Drag from './drag';

storiesOf('Components/Drag', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ padding: '20px' }}>
          <Drag
            source="bnb"
            target="bolt"
            onConfirm={() => alert('confirmed!')}
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
