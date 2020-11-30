import React from 'react';

import { storiesOf } from '@storybook/react';

import { PoolDetailStatusEnum } from 'types/generated/midgard';

import PoolFilter from './poolFilter';

storiesOf('Components/PoolFilter', module).add('default', () => {
  return (
    <PoolFilter
      onClick={key => console.log(key)}
      selected={PoolDetailStatusEnum.Enabled}
    />
  );
});
