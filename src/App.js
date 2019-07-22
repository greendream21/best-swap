import React from 'react';
import { ThemeProvider } from 'styled-components';

import PublicRoutes from './router';
import AppHolder from './AppStyle';
import { defaultTheme } from './settings';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <PublicRoutes />
      </AppHolder>
    </ThemeProvider>
  );
}

export default App;
