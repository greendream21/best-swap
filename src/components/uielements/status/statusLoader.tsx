import React from 'react';
import ContentLoader from 'react-content-loader';
import { StatusDirection } from './status.style';

type Props = {
  height?: number;
  width?: number;
  direction?: StatusDirection;
};

const StatusLoader: React.FC<Props> = (props: Props): JSX.Element => {
  const { width = 100, height = 65, direction = 'horizontal' } = props;

  return (
    <ContentLoader
      className="status-content-loader"
      height={height}
      width={width}
      speed={2}
    >
      {direction === 'vertical' && (
        <>
          <rect
            x="0"
            y="0"
            rx="2"
            ry="2"
            width={width * 0.6}
            height={height / 2 - 5}
          />
          <rect
            x="0"
            y="30"
            rx="2"
            ry="2"
            width={width}
            height={height / 2 - 5}
          />
        </>
      )}
      {direction === 'horizontal' && (
        <>
          <rect
            x="0"
            y="0"
            rx="2"
            ry="2"
            width={width * 0.33 - 5}
            height={height}
          />
          <rect
            x={width * 0.33 + 10}
            y="0"
            rx="2"
            ry="2"
            width={width * 0.66 - 5}
            height={height}
          />
        </>
      )}
    </ContentLoader>
  );
};

export default StatusLoader;
