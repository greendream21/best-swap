import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import asyncComponent from './helpers/AsyncFunc';

const routes = [
  {
    exact: true,
    path: '/',
    component: asyncComponent(() => import('./containers/pages/signin')),
  },
  {
    exact: true,
    path: '/signin',
    component: asyncComponent(() => import('./containers/pages/signin')),
  },
  {
    exact: true,
    path: '/signup',
    component: asyncComponent(() => import('./containers/pages/signup')),
  },
];

const PublicRoutes = () => {
  return (
    <Router>
      <div>
        {routes.map(singleRoute => {
          const { exact, ...otherProps } = singleRoute;
          return (
            <Route
              exact={exact !== false}
              key={singleRoute.path}
              {...otherProps}
            />
          );
        })}
      </div>
    </Router>
  );
};

export default PublicRoutes;
