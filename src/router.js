import React from 'react';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale-provider/en_US'; // same as default `locale` of `antd`
import PropTypes from 'prop-types';

import asyncComponent from './helpers/AsyncFunc';

const maintenanceRoute = [
  {
    path: '',
    component: asyncComponent(() => import('./containers/pages/500')),
  },
];

const publicRoutes = [
  {
    path: '',
    component: asyncComponent(() => import('./containers/DashApp')),
    exact: true,
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

const routes =
  process.env.REACT_APP_WEBSITE_STATUS === 'maintenance'
    ? maintenanceRoute
    : publicRoutes;

const PublicRoutes = props => {
  const { history } = props;

  return (
    <ConfigProvider locale={en_US}>
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
    </ConfigProvider>
  );
};

PublicRoutes.propTypes = {
  user: PropTypes.object, // Maybe<User>
  history: PropTypes.object,
};

export default connect(state => ({
  user: state.Wallet.user,
}))(PublicRoutes);
