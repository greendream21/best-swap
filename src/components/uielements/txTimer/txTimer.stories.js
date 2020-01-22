import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import TxTimer from './txTimer';

storiesOf('Components/TxTimer', module)
  .addDecorator(withKnobs)
  .add('dynamicValues', () => {
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <TxTimer
            status={boolean('status', false)}
            value={number('value', 0)}
            maxValue={number('max value', 100)}
            startTime={Date.now()}
          />
        </AppHolder>
      </ThemeProvider>
    );
  });
