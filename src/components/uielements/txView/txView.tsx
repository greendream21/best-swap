import React, { useState, useEffect, useCallback } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { TimerFullIcon, ConfirmIcon } from '../../icons/timerIcons';

import { TxViewWrapper } from './txView.style';

import 'react-circular-progressbar/dist/styles.css';

interface Props {
  status: boolean;
  value: number;
  maxValue: number;
  onEnd?: () => void;
  onClick?: () => void;
  className?: string;
}

const TxView: React.FC<Props> = (props): JSX.Element => {
  const {
    status,
    value,
    maxValue,
    onClick = () => {},
    onEnd = () => {},
    className = '',
  } = props;

  const [active, setActive] = useState(false);

  // Check if counter has reached the end
  const isEnd = useCallback(() => value === maxValue, [value, maxValue]);

  // Update `active` depending on `status`.
  // Since we handling internal `status` asynchronous the component has to be still `active`
  // even `status` might switched to false
  useEffect(() => {
    if (status) {
      setActive(true);
    }
  }, [status]);

  // Reset everything at end
  const handleEndTimer = useCallback(() => {
    onEnd();
    setActive(false);
  }, [onEnd]);

  // Delay the end of counting - for UX purposes only
  useEffect(() => {
    if (isEnd() && status) {
      const id = setTimeout(handleEndTimer, 1000);
      return () => clearTimeout(id);
    }
  }, [handleEndTimer, isEnd, status]);

  const final = isEnd() && !active;
  const CircularProgressbarStyle = `${
    final ? 'hide' : ''
  } timerchart-circular-progressbar`;

  return (
    <>
      <TxViewWrapper
        className={`txView-wrapper ${className}`}
        onClick={onClick}
      >
        <div className="timerchart-icon">
          {!final && <TimerFullIcon />}
          {final && <ConfirmIcon />}
        </div>
        {active && (
          <>
            <CircularProgressbar
              className={CircularProgressbarStyle}
              value={value}
              strokeWidth={12}
              counterClockwise
              styles={buildStyles({
                textColor: 'gray',
                textSize: '14px',
                pathColor: 'rgba(251,252,254,0.57)',
                trailColor: 'rgba(0,0,0,0)',
                pathTransition: 'stroke-dashoffset 0.5s linear 0s',
              })}
            />
          </>
        )}
      </TxViewWrapper>
    </>
  );
};

export default TxView;
