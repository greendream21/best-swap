import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';
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

const PublicRoutes = props => {
  const { history } = props;
  const language = 'en';
  const currentAppLocale = AppLocale[language];

  return (
    <LocaleProvider locale={currentAppLocale.antd}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <ConnectedRouter history={history}>
          <div>
            {routes.map(singleRoute => {
              const { exact = false, ...otherProps } = singleRoute;
              return (
                <Route exact={exact} key={singleRoute.path} {...otherProps} />
              );
            })}
          </div>
        </ConnectedRouter>
      </IntlProvider>
    </LocaleProvider>
  );
};

export default PublicRoutes;
