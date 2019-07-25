import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import asyncComponent from '../../helpers/AsyncFunc';

const routes = [
  {
    path: '',
    component: asyncComponent(() => import('../Home')),
  },
  {
    path: 'connect',
    component: asyncComponent(() => import('../Connect')),
  },
  {
    path: 'stats',
    component: asyncComponent(() => import('../Stats')),
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
