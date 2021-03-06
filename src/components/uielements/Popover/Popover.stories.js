import React from 'react';

import { storiesOf } from '@storybook/react';

import { Popover, TooltipIcon } from './Popover';

storiesOf('Components/Popover', module)
  .add('Popover', () => {
    return (
      <div>
        <Popover tooltip="content">Hover me</Popover>
      </div>
    );
  })
  .add('TooltipIcon', () => {
    return (
      <div>
        <TooltipIcon tooltip="content" />
      </div>
    );
  });
