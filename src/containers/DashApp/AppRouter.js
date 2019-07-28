import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import asyncComponent from '../../helpers/AsyncFunc';

const routes = [
  {
    path: '',
    component: asyncComponent(() => import('../pages/Home')),
  },
  {
    path: 'connect',
    component: asyncComponent(() => import('../pages/Connect')),
  },
  {
    path: 'stats',
    component: asyncComponent(() => import('../pages/Stats')),
  },
  {
    path: 'faqs',
    component: asyncComponent(() => import('../pages/Faqs')),
  },
  {
    path: 'network',
    component: asyncComponent(() => import('../pages/Network')),
  },
  {
    path: 'swap',
    component: asyncComponent(() => import('../pages/Swap')),
  },
];

class AppRouter extends Component {
  render() {
    const { url } = this.props;

    return (
      <div>
        {routes.map(singleRoute => {
          const { path, exact = true, ...otherProps } = singleRoute;
          return (
            <Route
              exact={exact}
              key={singleRoute.path}
              path={`${url}${singleRoute.path}`}
              {...otherProps}
            />
          );
        })}
      </div>
    );
  }
}

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
