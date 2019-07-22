import React from 'react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../settings';

export default component => (
  <ThemeProvider theme={defaultTheme}>{component}</ThemeProvider>
);
