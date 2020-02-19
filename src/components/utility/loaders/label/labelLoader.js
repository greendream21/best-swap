import React from 'react';
import ContentLoader from 'react-content-loader';

const LabelLoader = () => (
  <ContentLoader
    className="label-content-loader"
    height={20}
    width={100}
    speed={2}
    primarycolor="#F8F9FA"
    secondarycolor="#ECEEEF"
  >
    <rect x="0" y="0" rx="2" ry="2" width="100" height="20" />
  </ContentLoader>
);

export default LabelLoader;
