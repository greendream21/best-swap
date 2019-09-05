import React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';

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
  const { history, user } = props;
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

PublicRoutes.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};

export default connect(state => ({
  user: state.Wallet.user,
}))(PublicRoutes);
