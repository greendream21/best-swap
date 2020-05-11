import React from 'react';
import ContentLoader from 'react-content-loader';

export const AssetLoader = () => (
  <ContentLoader height={300} width={300} speed={2}>
    <circle cx="32" cy="46" r="18" />
    <rect x="60" y="30" rx="2" ry="2" width="60" height="14" />
    <rect x="60" y="50" rx="2" ry="2" width="60" height="14" />
    <rect x="200" y="50" rx="2" ry="2" width="60" height="14" />
    <circle cx="32" cy="96" r="18" />
    <rect x="60" y="80" rx="2" ry="2" width="60" height="14" />
    <rect x="60" y="100" rx="2" ry="2" width="60" height="14" />
    <rect x="200" y="100" rx="2" ry="2" width="60" height="14" />
    <circle cx="32" cy="146" r="18" />
    <rect x="60" y="130" rx="2" ry="2" width="60" height="14" />
    <rect x="60" y="150" rx="2" ry="2" width="60" height="14" />
    <rect x="200" y="150" rx="2" ry="2" width="60" height="14" />
  </ContentLoader>
);

export const StakeLoader = () => (
  <ContentLoader height={400} width={300} speed={2}>
    <circle cx="32" cy="46" r="18" />
    <circle cx="50" cy="46" r="18" />
    <rect x="80" y="40" rx="2" ry="2" width="80" height="14" />
    <rect x="200" y="40" rx="2" ry="2" width="60" height="14" />
    <circle cx="32" cy="96" r="18" />
    <circle cx="50" cy="96" r="18" />
    <rect x="80" y="90" rx="2" ry="2" width="80" height="14" />
    <rect x="200" y="90" rx="2" ry="2" width="60" height="14" />
    <circle cx="32" cy="146" r="18" />
    <circle cx="50" cy="146" r="18" />
    <rect x="80" y="140" rx="2" ry="2" width="80" height="14" />
    <rect x="200" y="140" rx="2" ry="2" width="60" height="14" />
  </ContentLoader>
);
