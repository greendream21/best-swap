import React from 'react';
import ContentLoader from 'react-content-loader';

const StatusLoader = () => (
  <ContentLoader
    className="status-content-loader"
    height={65}
    width={100}
    speed={2}
    primarycolor="#F8F9FA"
    secondarycolor="#ECEEEF"
  >
    <rect x="20" y="0" rx="2" ry="2" width="60" height="20" />
    <rect x="0" y="30" rx="2" ry="2" width="100" height="25" />
  </ContentLoader>
);

export default StatusLoader;
