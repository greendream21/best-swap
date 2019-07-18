import React from 'react';
import { ThemeProvider } from 'styled-components';

import PublicRoutes from './router';
import AppHolder from './AppStyle';
import themes from './settings/themes';
import { themeConfig } from './settings';

function App() {
  const defaultTheme = themes[themeConfig.theme];

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <PublicRoutes />
      </AppHolder>
    </ThemeProvider>
  );
}

export default App;
