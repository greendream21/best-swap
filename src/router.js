import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';

import AppLocale from './languageProvider';

import asyncComponent from './helpers/AsyncFunc';

const routes = [
  {
    path: '',
    component: asyncComponent(() => import('./containers/DashApp')),
  },
  {
    exact: true,
    path: '/404',
    component: asyncComponent(() => import('./containers/pages/404')),
  },
  {
    exact: true,
    path: '/500',
    component: asyncComponent(() => import('./containers/pages/500')),
  },
];

const PublicRoutes = () => {
  const language = 'en';
  const currentAppLocale = AppLocale[language];

  return (
    <LocaleProvider locale={currentAppLocale.antd}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Router>
          <div>
            {routes.map(singleRoute => {
              const { exact = false, ...otherProps } = singleRoute;
              return (
                <Route exact={exact} key={singleRoute.path} {...otherProps} />
              );
            })}
          </div>
        </Router>
      </IntlProvider>
    </LocaleProvider>
  );
};

export default PublicRoutes;
