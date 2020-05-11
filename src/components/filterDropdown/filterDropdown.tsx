import React, { useCallback, ReactNode } from 'react';
import { Dropdown } from 'antd';
import {
  DatabaseOutlined,
  SwapOutlined,
  DoubleRightOutlined,
  ImportOutlined,
  CaretDownOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { ClickParam } from 'antd/lib/menu';
import { keyBy as _keyBy } from 'lodash';

import { TxDetailsTypeEnum } from '../../types/generated/midgard';
import { Menu, DesktopButton, MobileButton } from './filterDropdown.style';

export type FilterValue =
  | TxDetailsTypeEnum.Swap
  | TxDetailsTypeEnum.Stake
  | TxDetailsTypeEnum.Unstake
  | 'all';

type Props = {
  value: string;
  onClick?: (key: string) => void;
};

type MenuItem = {
  icon: ReactNode;
  title: string;
  key: FilterValue;
};

type MenuItems = MenuItem[];

const FilterDropdown: React.FC<Props> = (props: Props): JSX.Element => {
  const { value, onClick } = props;

  const items: MenuItems = [
    {
      icon: <DatabaseOutlined />,
      title: 'ALL',
      key: 'all',
    },
    {
      icon: <SwapOutlined />,
      title: 'SWAP',
      key: TxDetailsTypeEnum.Swap,
    },
    {
      icon: <DoubleRightOutlined />,
      title: 'STAKE',
      key: TxDetailsTypeEnum.Stake,
    },
    {
      icon: <ImportOutlined />,
      title: 'WITHDRAW',
      key: TxDetailsTypeEnum.Unstake,
    },
  ];

  const handleClickItem = useCallback(
    ({ key }: ClickParam) => {
      if (onClick) onClick(key);
    },
    [onClick],
  );

  const renderMenu = () => {
    return (
      <Menu
        className="filterDropdown-menu-items"
        onClick={handleClickItem}
        selectedKeys={[value]}
      >
        {items.map(item => {
          return (
            <Menu.Item key={item.key}>
              {item.icon} {item.title}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  const menuLabel = value === TxDetailsTypeEnum.Unstake ? 'WITHDRAW' : value;

  return (
    <Dropdown overlay={renderMenu()} trigger={['click']}>
      <div className="dropdown-wrapper">
        <DesktopButton color="primary" typevalue="outline">
          {menuLabel} <CaretDownOutlined />
        </DesktopButton>
        <MobileButton color="primary" typevalue="ghost">
          <FilterOutlined />
        </MobileButton>
      </div>
    </Dropdown>
  );
};

export default FilterDropdown;
