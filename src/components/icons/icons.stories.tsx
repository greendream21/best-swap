import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  TimerFullIcon,
  TimerChartIcon1,
  TimerChartIcon2,
  TimerChartIcon3,
  TimerChartIcon4,
} from './timerIcons';

storiesOf('Icons/TimerIcons', module).add('default', () => {
  return (
    <div>
      <TimerFullIcon />
      <TimerChartIcon1 />
      <TimerChartIcon2 />
      <TimerChartIcon3 />
      <TimerChartIcon4 />
    </div>
  );
});
