import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import TxView from './txView';

storiesOf('Components/TxView', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <TxView
            status={boolean('status', false)}
            value={number('value', 0)}
            maxValue={number('max value', 100)}
          />
        </AppHolder>
      </ThemeProvider>
    );
  });
