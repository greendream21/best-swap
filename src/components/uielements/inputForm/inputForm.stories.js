import React from 'react';
import { storiesOf } from '@storybook/react';

import InputForm from './inputForm';

storiesOf('Components/InputForm', module).add('default', () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        background: 'gray',
      }}
    >
      <InputForm title="Add earnings:" type="rune" />
      <InputForm title="Add earnings:" type="rune" reverse />
    </div>
  );
});
