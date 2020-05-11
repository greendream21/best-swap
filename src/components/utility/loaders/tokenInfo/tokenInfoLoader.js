import React from 'react';
import ContentLoader from 'react-content-loader';

const TokenInfoLoader = () => (
  <ContentLoader className="content-loader" height={110} width={230} speed={2}>
    <rect x="10" y="10" rx="2" ry="2" width="100" height="20" />
    <rect x="180" y="10" rx="2" ry="2" width="34" height="20" />
    <rect x="10" y="40" rx="2" ry="2" width="80" height="30" />
    <rect x="10" y="80" rx="2" ry="2" width="100" height="20" />
  </ContentLoader>
);

export default TokenInfoLoader;
