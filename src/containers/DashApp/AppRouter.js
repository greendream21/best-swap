import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { history } from '../../redux/store';

import asyncComponent from '../../helpers/AsyncFunc';

const routes = [
  {
    path: '',
    component: asyncComponent(() => import('../pages/Swap/SwapLanding')),
  },
  {
    path: 'introduction/:view?',
    component: asyncComponent(() => import('../pages/Home')),
  },
  {
    path: 'tutorial/:type?/:view?/:content?',
    component: asyncComponent(() => import('../pages/Tutorial')),
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
    path: 'swap/:view?/:info?',
    component: asyncComponent(() => import('../pages/Swap')),
  },
  {
    path: 'pools',
    component: asyncComponent(() => import('../pages/Pool/Pools')),
  },
  {
    path: 'pool/:symbol/:action?',
    component: asyncComponent(() => import('../pages/Pool')),
  },
  {
    path: 'transaction',
    component: asyncComponent(() => import('../pages/Transactions')),
  },
];

class AppRouter extends Component {
  render() {
    const { url } = this.props;

    return (
      <div>
        <Router history={history}>
          <Switch>
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
          </Switch>
        </Router>
      </div>
    );
  }
}

AppRouter.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AppRouter;
