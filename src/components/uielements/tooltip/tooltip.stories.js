import React from 'react';
import { storiesOf } from '@storybook/react';

import Tooltip from './tooltip';
import Button from '../button';

storiesOf('Components/ToolTip', module).add('default', () => {
  return (
    <div>
      <Tooltip placement="bottomLeft" content="This is tooltip text">
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  );
});
