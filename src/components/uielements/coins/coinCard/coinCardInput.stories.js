import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';
import { CoinCardInput } from './coinCardInput';

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
      <CoinCardInput value={value} onChange={handleChange} />;
      <button type="button" onClick={setExternalVal}>
        Doit
      </button>
    </div>
  );
}

storiesOf('Components/CoinCardInput', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <CoinCardInputStory />
      </AppHolder>
    </ThemeProvider>
  );
});
