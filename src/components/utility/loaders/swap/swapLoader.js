import React from 'react';
import ContentLoader from 'react-content-loader';

const SwapLoader = () => (
  <ContentLoader
    height={400}
    width={1000}
    speed={2}
    primaryColor="#F8F9FA"
    secondaryColor="#ECEEEF"
  >
    <rect x="0" y="20" rx="2" ry="2" width="120" height="20" />
    <rect x="0" y="56" rx="4" ry="4" width="120" height="50" />
    <rect x="0" y="120" rx="4" ry="4" width="80%" height="80" />
    <rect x="0" y="210" rx="4" ry="4" width="80%" height="80" />
    <rect x="0" y="300" rx="4" ry="4" width="80%" height="80" />
  </ContentLoader>
);

export default SwapLoader;
