import React from 'react';

import renderSwapWrapper from './renderSwapWrapper';

type Props = {};

const SwapLanding: React.FC<Props> = (_: Props): JSX.Element => {
  return renderSwapWrapper({ view: 'landing', info: 'bnb-rune' });
};

export default SwapLanding;
