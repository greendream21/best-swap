import React, { useState } from 'react';
import { Drawer, Icon, Button } from 'antd';

import WalletView from './WalletView';

const WalletDrawer = props => {
  const [visible, setVisible] = useState(false);

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div style={props.style}>
      <Button shape="circle" onClick={toggleDrawer}>
        <Icon type="wallet" />
      </Button>
      <Drawer
        placement="right"
        closable={false}
        width={300}
        onClose={onClose}
        visible={visible}
      >
        <WalletView />
      </Drawer>
    </div>
  );
};

export default WalletDrawer;
