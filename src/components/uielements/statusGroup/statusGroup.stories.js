import React from 'react';

import { storiesOf } from '@storybook/react';

import { stats } from './data';
import StatusGroup from './statusGroup';

storiesOf('Components/StatusGroup', module).add('default', () => {
  return (
    <div>
      <StatusGroup title="users" status={stats.users} />
      <StatusGroup title="transactions" status={stats.transactions} />
      <StatusGroup title="pools" status={stats.pools} />
      <StatusGroup title="members" status={stats.stakers} />
    </div>
  );
});
