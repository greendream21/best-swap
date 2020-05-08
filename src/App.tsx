import React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import themes, { ThemeType } from '@thorchain/asgardex-theme';
import { IntlProvider } from 'react-intl';
import { store as reduxStore, history, RootState } from './redux/store';

import PublicRoutes from './router';
import { AppHolder, fontConfig } from './settings/appStyle';
import WebFontLoader from './components/utility/webfontloader';

const Main = () => {
  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const { light, dark } = themes;
  const defaultTheme = isLight ? light : dark;

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder id="app-global">
        <PublicRoutes history={history} />
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
