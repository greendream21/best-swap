import React from 'react';
import { storiesOf } from '@storybook/react';

import PoolFilter from './poolFilter';
import { PoolDetailStatusEnum } from '../../types/generated/midgard';

storiesOf('Components/PoolFilter', module).add('default', () => {
  return (
    <PoolFilter
      onClick={key => console.log(key)}
      selected={PoolDetailStatusEnum.Enabled}
    />
  );
});
