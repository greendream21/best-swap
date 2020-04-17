import React from 'react';

import renderSwapWrapper from './renderSwapWrapper';

type Props = {};

const Swap: React.FC<Props> = (_: Props): JSX.Element => {
  return renderSwapWrapper({ view: 'view' });
};

export default Swap;
