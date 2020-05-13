import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react/dist/client/preview';
import { withKnobs } from '@storybook/addon-knobs';

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../src/settings';
import { AppHolder } from '../src/settings/appStyle';

import { withThemes } from '@react-theming/storybook-addon';

import 'antd/dist/antd.css';
import './global.css';

addDecorator(withKnobs);
addDecorator(story => (
  <Router>
    <Route path="/" component={() => story()} />
  </Router>
));

const providerFn = ({ theme, children }) => (<ThemeProvider theme={theme}>
     <AppHolder>{children}</AppHolder>
   </ThemeProvider>
   )

addDecorator(withThemes(null, [lightTheme, darkTheme], { providerFn }));

const req = require.context('../src', true, /\.stories\.(js|ts|tsx)$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
