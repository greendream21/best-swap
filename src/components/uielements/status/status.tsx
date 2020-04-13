import React from 'react';
import styled from 'styled-components';

import { StatusWrapper, StatusDirection } from './status.style';
import Label from '../label';
import StatusLoader from './statusLoader';

const NoWrapLabel = styled(Label)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = {
  title?: string;
  value?: string;
  direction?: StatusDirection;
  loading?: boolean;
  className?: string;
};

const Status: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    title = '',
    value = '',
    direction = 'vertical',
    loading = false,
    className = '',
    ...otherProps
  } = props;

  const isHorizontal = direction === 'horizontal';
  return (
    <StatusWrapper
      className={`status-wrapper ${className}`}
      direction={direction}
      {...otherProps}
    >
      {loading && <StatusLoader direction={direction} width={isHorizontal ? 150 : undefined} height={isHorizontal ? 30 : undefined} />}
      {!loading && (
        <>
          <NoWrapLabel className="status-title" size="normal" color="gray">
            {title}
          </NoWrapLabel>
          <NoWrapLabel className="status-value" size="normal">
            {value}
          </NoWrapLabel>
        </>
      )}
    </StatusWrapper>
  );
};

export default Status;
