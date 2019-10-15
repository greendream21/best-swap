import React from 'react';

import WSProvider from './WSProvider';

export const withWebsocket = (url, dataKey, options) => Component => {
  return props => {
    return (
      <WSProvider url={url} {...options}>
        {({ data }) => {
          const newProps = {
            [dataKey]: JSON.parse(data),
          };

          return <Component {...props} {...newProps} />;
        }}
      </WSProvider>
    );
  };
};
