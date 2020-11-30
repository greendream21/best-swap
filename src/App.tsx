import React from 'react';

import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider, useSelector } from 'react-redux';

import themes, { ThemeType } from '@thorchain/asgardex-theme';
import { ThemeProvider } from 'styled-components';

import WebFontLoader from 'components/utility/webfontloader';

import { store as reduxStore, history, RootState } from 'redux/store';

import { AppHolder, fontConfig } from 'settings/appStyle';

import Routes from './router';

const Main = () => {
  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const { light, dark } = themes;
  const defaultTheme = isLight ? light : dark;

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder id="app-global">
        <Routes history={history} />
      </AppHolder>
    </ThemeProvider>
  );
};

function App() {
  return (
    <WebFontLoader config={fontConfig}>
      <ReduxProvider store={reduxStore}>
        <IntlProvider locale={navigator.language}>
          <Main />
        </IntlProvider>
      </ReduxProvider>
    </WebFontLoader>
  );
}

export default App;
