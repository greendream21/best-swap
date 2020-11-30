import React from 'react';

import { storiesOf } from '@storybook/react';

import Button from '../button';
import Tooltip from './tooltip';

storiesOf('Components/ToolTip', module).add('default', () => {
  return (
    <div>
      <Tooltip placement="bottomLeft" content="This is tooltip text">
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  );
});
