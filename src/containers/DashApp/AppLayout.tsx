import React, { ReactNode, useEffect } from 'react';
import { Layout, notification } from 'antd';
import { connect } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { RootState } from '../../redux/store';
import { ApiBasePathRD } from '../../redux/midgard/types';
import { TransferEventRD } from '../../redux/binance/types';

type ComponentProps = {
  children?: ReactNode;
  'data-test': string;
};

type ConnectedProps = {
  midgardBasePath: ApiBasePathRD;
  wsTransferEvent: TransferEventRD;
};

type Props = ComponentProps & ConnectedProps;

const AppLayout: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    children,
    'data-test': dataTest,
    midgardBasePath,
    wsTransferEvent,
  } = props;

  useEffect(() => {
    const ignore = () => {};
    const onFailure = (error: Error) => {
      notification.error({
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
      notification.error({
        message: 'Binance Websocket Error',
        description: `Subscription to transfers failed. ${error?.toString() ??
          ''}`,
        duration: 10,
      });
    };
    RD.fold(ignore, ignore, onFailure, ignore)(wsTransferEvent);
  }, [wsTransferEvent]);

  return <Layout data-test={dataTest}>{children}</Layout>;
};

export default connect(
  (state: RootState) => ({
    midgardBasePath: state.Midgard.apiBasePath,
    wsTransferEvent: state.Binance.wsTransferEvent,
  }),
  {},
)(AppLayout);
