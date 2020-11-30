import React from 'react';

import { storiesOf } from '@storybook/react';

import { TxDetailsTypeEnum } from 'types/generated/midgard';

import FilterDropdown from './filterDropdown';

storiesOf('Components/FilterDropdown', module).add('default', () => {
  return (
    <FilterDropdown
      onClick={key => console.log(key)}
      value={TxDetailsTypeEnum.Swap}
    />
  );
});
