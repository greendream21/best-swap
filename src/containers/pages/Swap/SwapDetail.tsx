import React from 'react';

import { useParams } from 'react-router-dom';
import renderSwapWrapper from './renderSwapWrapper';

type Props = {};

const SwapDetail: React.FC<Props> = (_: Props): JSX.Element => {
  const { info } = useParams();
  return renderSwapWrapper({ view: 'detail', info });
};

export default SwapDetail;
