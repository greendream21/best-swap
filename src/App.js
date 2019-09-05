import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { store as reduxStore, history } from './redux/store';

import PublicRoutes from './router';
import AppHolder from './AppStyle';
import { defaultTheme } from './settings';

function App() {
  return (
    <ReduxProvider store={reduxStore}>
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <PublicRoutes history={history} />
        </AppHolder>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default App;
