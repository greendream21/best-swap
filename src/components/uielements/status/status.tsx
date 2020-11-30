import React from 'react';

import styled from 'styled-components';

import Label from '../label';
import { StatusWrapper, StatusDirection } from './status.style';

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

  return (
    <StatusWrapper
      className={`status-wrapper ${className}`}
      direction={direction}
      {...otherProps}
    >
      {loading && '...'}
      {!loading && (
        <>
          {title && (
            <NoWrapLabel className="status-title" size="normal" color="gray">
              {title}
            </NoWrapLabel>
          )}
          <NoWrapLabel className="status-value" size="normal">
            {value}
          </NoWrapLabel>
        </>
      )}
    </StatusWrapper>
  );
};

export default Status;
