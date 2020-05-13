import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react/dist/client/preview';
import { withKnobs } from '@storybook/addon-knobs';

import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../src/settings';
import { AppHolder } from '../src/settings/appStyle';

import 'antd/dist/antd.css';
import './global.css';

addDecorator(withKnobs);
addDecorator(story => (
  <Router>
    <Route path="/" component={() => story()} />
  </Router>
));
addDecorator(story => (
  <ThemeProvider theme={defaultTheme}>
    <AppHolder>{story()}</AppHolder>
  </ThemeProvider>
));

const req = require.context('../src', true, /\.stories\.(js|ts|tsx)$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
