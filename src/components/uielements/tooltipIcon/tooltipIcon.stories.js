import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import TooltipIcon from './tooltipIcon';

storiesOf('Components/ToolTipIcon', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div>
          <TooltipIcon text="this is tooltip" placement="bottomRight" />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
