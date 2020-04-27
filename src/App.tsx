import React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { IntlProvider } from 'react-intl';
import { store as reduxStore, history, RootState } from './redux/store';

import PublicRoutes from './router';
import { AppHolder, GlobalStyle } from './settings/appStyle';
import { lightTheme, darkTheme } from './settings';
import { LIGHT_THEME } from './settings/themes';

const Main = () => {
  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === LIGHT_THEME;
  const defaultTheme = isLight ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle isLight />
      <AppHolder id="app-global">
        <PublicRoutes history={history} />
      </AppHolder>
    </ThemeProvider>
  );
};

function App() {
  return (
    <ReduxProvider store={reduxStore}>
      <IntlProvider locale={navigator.language}>
        <Main />
      </IntlProvider>
    </ReduxProvider>
  );
}

export default App;
