import React, { ReactNode, useEffect } from 'react';

import { connect } from 'react-redux';

import * as RD from '@devexperts/remote-data-ts';
import { Layout } from 'antd';


import showNotification from 'components/uielements/notification';

import { TransferEventRD } from 'redux/binance/types';
import { ApiBasePathRD } from 'redux/midgard/types';
import { RootState } from 'redux/store';

type ComponentProps = {
  children?: ReactNode;
};

type ConnectedProps = {
  midgardBasePath: ApiBasePathRD;
  wsTransferEvent: TransferEventRD;
};

type Props = ComponentProps & ConnectedProps;

const AppLayout: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    children,
    midgardBasePath,
    wsTransferEvent,
  } = props;

  useEffect(() => {
    const ignore = () => {};
    const onFailure = (error: Error) => {
      showNotification({
        type: 'error',
        message: 'Byzantine Error',
        description: `Getting base path for Midgard API failed. ${error?.toString() ??
          ''}`,
        duration: 10,
      });
    };
    RD.fold(ignore, ignore, onFailure, ignore)(midgardBasePath);
  }, [midgardBasePath]);

  useEffect(() => {
    const ignore = () => {};
    const onFailure = (error: Error) => {
      showNotification({
        type: 'error',
        message: 'Binance Websocket Error',
        description: `Subscription to transfers failed. ${error?.toString() ??
          ''}`,
        duration: 10,
      });
    };
    RD.fold(ignore, ignore, onFailure, ignore)(wsTransferEvent);
  }, [wsTransferEvent]);

  return <Layout>{children}</Layout>;
};

export default connect(
  (state: RootState) => ({
    midgardBasePath: state.Midgard.apiBasePath,
    wsTransferEvent: state.Binance.wsTransferEvent,
  }),
  {},
)(AppLayout);
