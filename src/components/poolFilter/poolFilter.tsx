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
      Pools don't immediately become enabled on THORChain and must
      participate in a liquidity competition to become enabled.

      Every 50k blocks (approx 3 days), the pool with the most
      liquidity wins & becomes enabled.

      During this time swapping is disabled but liquidity can be added & withdrawn.
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
