import React, { useCallback } from 'react';

import { Moon, Sun } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';

import { ThemeType } from '@thorchain/asgardex-theme';

import * as appActions from 'redux/app/actions';
import { RootState } from 'redux/store';

import * as Styled from './themeSwitch.style';

const ThemeSwitch: React.FC = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.App.themeType);
  const dispatch = useDispatch();
  const setTheme = useCallback(
    (themeType: string) => dispatch(appActions.setTheme(themeType)),
    [dispatch],
  );
  const toggleTheme = useCallback(
    () => {
      setTheme(themeType === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK);
    },
    [setTheme, themeType],
  );

  return (
    <Styled.IconButton onClick={toggleTheme}>
      {themeType === ThemeType.DARK ? <Moon /> : <Sun />}
    </Styled.IconButton>
  );
};

export default ThemeSwitch;
