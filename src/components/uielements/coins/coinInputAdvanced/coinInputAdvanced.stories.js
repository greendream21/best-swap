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
      setValue(newVal.target.value);
      console.log({ newVal });
    },
    [setValue],
  );
  const setExternalVal = React.useCallback(() => {
    setValue(40000);
  }, [setValue]);
  return (
    <div>
      <CoinInputAdvanced value={value} onChange={handleChange} />;
      <button type="button" onClick={setExternalVal}>
        Send external 40k
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
