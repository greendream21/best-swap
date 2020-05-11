/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import WebFont from 'webfontloader';

type Props = {
  config: WebFont.Config;
  onStatus?(status: string): void;
  children: JSX.Element;
};

const WebFontLoader: React.FC<Props> = (props): JSX.Element => {
  const { config, onStatus, children } = props;
  const [status, setStatus] = useState<string>('');

  const handleLoading = () => {
    setStatus('loading');
  };

  const handleActive = () => {
    setStatus('active');
  };

  const handleInactive = () => {
    setStatus('inactive');
  };

  const loadFonts = () => {
    WebFont.load({
      ...config,
      loading: handleLoading,
      active: handleActive,
      inactive: handleInactive,
    });
  };

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    onStatus && onStatus(status);
  }, [onStatus, status]);

  return children;
};

export default WebFontLoader;
