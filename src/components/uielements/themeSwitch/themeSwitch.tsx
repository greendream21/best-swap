/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwitchProps } from 'antd/lib/switch';
import { StyledSwitch, EmojiIcon } from './themeSwitch.style';
import { RootState } from '../../../redux/store';
import * as appActions from '../../../redux/app/actions';

import { LIGHT_THEME, DARK_THEME } from '../../../settings/themes';

type ComponentProps = {
  className?: string;
};

type Props = ComponentProps & SwitchProps;

const AssetInfo: React.FC<Props> = (props: Props): JSX.Element => {
  const { className = '', ...otherProps } = props;
  const themeType = useSelector((state: RootState) => state.App.themeType);
  const dispatch = useDispatch();
  const setTheme = useCallback(
    (themeType: string) => dispatch(appActions.setTheme(themeType)),
    [dispatch],
  );
  const toggleTheme = useCallback(
    (value: boolean) => {
      setTheme(value ? LIGHT_THEME : DARK_THEME);
    },
    [setTheme],
  );

  const isLight = themeType === LIGHT_THEME;

  const sunIcon = (
    <EmojiIcon role="img" aria-label="sun">
      ☀️
    </EmojiIcon>
  );
  const moonIcon = (
    <EmojiIcon role="img" aria-label="moon">
      🌙️
    </EmojiIcon>
  );

  return (
    <StyledSwitch
      className={`themeSwitch-wrapper ${className}`}
      checked={isLight}
      onChange={toggleTheme}
      checkedChildren={sunIcon}
      unCheckedChildren={moonIcon}
      {...otherProps}
    />
  );
};

export default AssetInfo;
