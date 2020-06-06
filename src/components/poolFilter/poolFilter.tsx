/* eslint-disable react/no-unescaped-entities */
import React, { useCallback } from 'react';
import { Popover } from 'antd';
import {
  CheckCircleOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';

import { PoolFilterWrapper, PopoverContent, PopoverIcon } from './poolFilter.style';
import Button from '../uielements/button';
import { PoolDetailStatusEnum } from '../../types/generated/midgard/api';

type Props = {
  selected: PoolDetailStatusEnum;
  onClick: (key: PoolDetailStatusEnum) => void;
};

const PoolFilter: React.FC<Props> = (props: Props): JSX.Element => {
  const { selected, onClick } = props;

  const handleClick = useCallback(
    (key: PoolDetailStatusEnum) => {
      onClick(key);
    },
    [onClick],
  );

  const getPopupContainer = () => {
    return document.getElementsByClassName('pool-filter')[0] as HTMLElement;
  };

  const renderPopoverContent = () => (
    <PopoverContent>
      Pools don't immediately become enabled on THORChain and new pools must
      participate in a liquidity competition which is held every 50000 blocks
      (approximately 3 days). The pool with the most liquidity measured in RUNE
      wins and becomes enabled. During the competition phase, liquidity can be
      added & withdrawn from the pending pools, however users cannot swap across
      these pools.
    </PopoverContent>
  );

  return (
    <PoolFilterWrapper className="pool-filter">
      <Button
        typevalue="outline"
        round="true"
        onClick={() => handleClick(PoolDetailStatusEnum.Enabled)}
        focused={selected === PoolDetailStatusEnum.Enabled}
      >
        <CheckCircleOutlined />
        Active
      </Button>
      <Button
        typevalue="outline"
        round="true"
        onClick={() => handleClick(PoolDetailStatusEnum.Bootstrapped)}
        focused={selected === PoolDetailStatusEnum.Bootstrapped}
      >
        <FieldTimeOutlined />
        Pending
      </Button>
      <Popover
        content={renderPopoverContent}
        getPopupContainer={getPopupContainer}
        placement="bottomRight"
        overlayClassName="pool-filter-info"
        overlayStyle={{
          padding: '6px',
          animationDuration: '0s !important',
          animation: 'none !important',
        }}
      >
        <PopoverIcon />
      </Popover>
    </PoolFilterWrapper>
  );
};

export default PoolFilter;
