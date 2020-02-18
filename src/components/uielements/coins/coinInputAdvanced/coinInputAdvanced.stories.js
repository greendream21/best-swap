import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';
import { CoinInputAdvanced } from './coinInputAdvanced';

function CoinCardInputStory() {
  const [value, setValue] = React.useState(1002.34);

  const handleChange = React.useCallback(
    newVal => {
      setValue(newVal);
    },
    [setValue],
  );
  const setExternalVal = React.useCallback(
    v => {
      setValue(v);
    },
    [setValue],
  );
  return (
    <div>
      <CoinInputAdvanced value={value} onChange={handleChange} />
      <button type="button" onClick={() => setExternalVal(40000)}>
        Send external 40k
      </button>
      <button type="button" onClick={() => setExternalVal(2000)}>
        Send external 2k
      </button>
    </div>
  );
}

storiesOf('Components/Coins/CoinCardInput', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <CoinCardInputStory />
      </AppHolder>
    </ThemeProvider>
  );
});
