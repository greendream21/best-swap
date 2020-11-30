import React from 'react';

import ContentLoader from 'react-content-loader';

const TransactionLoader: React.FC = (): JSX.Element => (
  <ContentLoader className="content-loader" height={400} width="100%" speed={2}>
    <rect x="0" y="10" rx="4" ry="4" width="100%" height="60" />
    <rect x="0" y="90" rx="4" ry="4" width="100%" height="60" />
    <rect x="0" y="170" rx="4" ry="4" width="100%" height="60" />
    <rect x="0" y="250" rx="4" ry="4" width="100%" height="60" />
    <rect x="0" y="330" rx="4" ry="4" width="100%" height="60" />
  </ContentLoader>
);

export default TransactionLoader;
