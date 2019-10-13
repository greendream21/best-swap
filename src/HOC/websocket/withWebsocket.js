import React from 'react';

import WSProvider from './WSProvider';

export const withWebsocket = (url, dataKey) => Component => {
  return props => {
    return (
      <WSProvider url={url}>
        {({ data }) => {
          const newProps = {
            [dataKey]: data,
          };

          return <Component {...props} {...newProps} />;
        }}
      </WSProvider>
    );
  };
};
