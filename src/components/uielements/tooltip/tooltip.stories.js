import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Tooltip from './tooltip';
import Button from '../button';

storiesOf('Components/ToolTip', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div>
          <Tooltip placement="bottomLeft" text="this is tooltip text!">
            <Button>Hover me</Button>
          </Tooltip>
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
