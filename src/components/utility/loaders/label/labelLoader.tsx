import React from 'react';


import ContentLoader from 'react-content-loader';
import { useSelector } from 'react-redux';

import themes, { ThemeType } from '@thorchain/asgardex-theme';

import { RootState } from 'redux/store';

const LabelLoader = () => {
  const themeType = useSelector((state: RootState) => state.App.themeType);
  const isLight = themeType === ThemeType.LIGHT;
  const theme = isLight ? themes.light : themes.dark;

  return (
    <ContentLoader
      className="content-loader"
      backgroundColor={theme.palette.background[2]}
      foregroundColor={theme.palette.gray[1]}
      height={20}
      width={60}
      speed={1.2}
    >
      <rect x="0" y="0" rx="2" ry="2" width="60" height="20" />
    </ContentLoader>
  );
};

export default LabelLoader;
