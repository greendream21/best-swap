import React, { useCallback, useState, useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { ClickParam } from 'antd/lib/menu';
import { Menu, MenuItem } from './filterMenu.style';

import Input from '../input';
import { AssetPair } from '../../../types/bepswap';

type Props = {
  onSelect?: (value: string) => void;
  filterFunction: (item: AssetPair, searchTerm: string) => boolean;
  searchEnabled?: boolean;
  cellRenderer: (data: AssetPair) => { key: string; node: JSX.Element };
  data: AssetPair[];
  disableItemFilter?: (item: AssetPair) => boolean;
  placeholder?: string;
};

const FilterMenu: React.FC<Props> = ({
  onSelect = _ => {},
  searchEnabled = false,
  data,
  filterFunction,
  cellRenderer,
  disableItemFilter = _ => false,
  placeholder = 'Search Token ...',
  ...otherProps
}): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = useCallback(
    (event: ClickParam) => {
      // (Rudi) bail if this is triggered by the search menu item
      if (!event || !event.key || event.key === '_search') return;

      setSearchTerm('');
      onSelect(event.key);
    },
    [onSelect],
  );

  const handleSearchChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = event.currentTarget.value;
      setSearchTerm(newSearchTerm);
    },
    [],
  );

  const filteredData: AssetPair[] = useMemo(
    () =>
      searchTerm === ''
        ? data
        : data.filter(item => filterFunction(item, searchTerm)),
    [data, filterFunction, searchTerm],
  );

  return (
    <Menu {...otherProps} onClick={handleClick}>
      {searchEnabled && (
        <Menu.Item disabled key="_search">
          <Input
            value={searchTerm}
            onChange={handleSearchChanged}
            placeholder={placeholder}
            typevalue="ghost"
            suffix={<SearchOutlined />}
          />
        </Menu.Item>
      )}
      {filteredData.map((item: AssetPair) => {
        const { key, node } = cellRenderer(item);
        const disableItem = disableItemFilter(item);

        return (
          <MenuItem disabled={disableItem} key={key}>
            {node}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default FilterMenu;
