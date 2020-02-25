import React, { useCallback, useState, useMemo } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from './filterMenu.style';

import Input from '../input';

export default function FilterMenu({
  onSelect,
  onBlurDropdown,
  disableItemFilter = () => false,
  searchEnabled,
  data,
  filterFunction,
  cellRenderer,
  placeholder = 'Search Token ...',
  ...props
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = useCallback(
    event => {
      // bail if this is triggered by the search menu item
      if (!event || !event.key || event.key === '_search') return;

      setSearchTerm('');
      onSelect(event);
    },
    [onSelect],
  );

  const handleSearchChanged = useCallback(event => {
    const newSearchTerm = event.currentTarget.value;
    setSearchTerm(newSearchTerm);
  }, []);

  const handleBlur = useCallback(
    event => {
      if (!event.key) return;

      if (onBlurDropdown) onBlurDropdown(event);
    },
    [onBlurDropdown],
  );

  const filteredData = useMemo(
    () =>
      searchTerm === ''
        ? data
        : data.filter(item => filterFunction(item, searchTerm)),
    [data, filterFunction, searchTerm],
  );

  return (
    <Menu {...props} onClick={handleClick} onBlur={handleBlur}>
      {searchEnabled && (
        <Menu.Item disabled key="_search">
          <Input
            value={searchTerm}
            onChange={handleSearchChanged}
            placeholder={placeholder}
            typevalue="ghost"
            suffix={<Icon type="search" />}
          />
        </Menu.Item>
      )}
      {filteredData.map(item => {
        const { key, node } = cellRenderer(item);
        const disabled = disableItemFilter(item);

        return (
          <MenuItem disabled={disabled} key={key}>
            {node}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

FilterMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onBlurDropdown: PropTypes.func,
  filterFunction: PropTypes.func.isRequired,
  searchEnabled: PropTypes.bool,
  cellRenderer: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  disableItemFilter: PropTypes.func,
  placeholder: PropTypes.string,
};
