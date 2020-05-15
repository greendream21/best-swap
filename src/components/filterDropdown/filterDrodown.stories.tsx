import React from 'react';
import { storiesOf } from '@storybook/react';

import FilterDropdown from './filterDropdown';
import { TxDetailsTypeEnum } from '../../types/generated/midgard';

storiesOf('Components/FilterDropdown', module).add('default', () => {
  return (
    <FilterDropdown
      onClick={key => console.log(key)}
      value={TxDetailsTypeEnum.Swap}
    />
  );
});
