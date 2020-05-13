import React from 'react';
import { storiesOf } from '@storybook/react';

import TooltipIcon from './tooltipIcon';

storiesOf('Components/ToolTipIcon', module).add('default', () => {
  return (
    <div>
      <TooltipIcon text="this is tooltip" placement="bottomRight" />
    </div>
  );
});
