import React from 'react';
import ContentLoader from 'react-content-loader';

const PoolLoader = () => (
  <ContentLoader
    height={400}
    width={1000}
    speed={2}
    primaryColor="#F8F9FA"
    secondaryColor="#ECEEEF"
  >
    <rect x="0" y="20" rx="4" ry="4" width="80%" height="80" />
    <rect x="0" y="110" rx="4" ry="4" width="80%" height="80" />
    <rect x="0" y="200" rx="4" ry="4" width="80%" height="80" />
    <circle cx="15" cy="305" r="15" />
    <rect x="40" y="295" rx="2" ry="2" width="120" height="20" />
  </ContentLoader>
);

export default PoolLoader;
