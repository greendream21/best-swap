import React from 'react';

import WSProvider from './WSProvider';

export const withWebsocket = url => Component => {
  return props => {
    return (
      <WSProvider url={url}>
        {({ data }) => <Component {...props} data={data} />}
      </WSProvider>
    );
  };
};
