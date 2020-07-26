import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { TimerFullIcon, ConfirmIcon } from '../../icons/timerIcons';

import { TxProgressWrapper } from './txProgress.style';

import 'react-circular-progressbar/dist/styles.css';

interface Props {
  status: boolean;
  value: number;
  maxValue: number;
  onEnd?: () => void;
  onClick?: () => void;
  className?: string;
}

const TxProgress: React.FC<Props> = (props): JSX.Element => {
  const {
    status,
    value,
    maxValue,
    onClick = () => {},
    onEnd = () => {},
    className = '',
  } = props;

  const [active, setActive] = useState(false);

  const isEnd = useMemo(() => value >= maxValue, [value, maxValue]);

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
    console.log('end timer called');

    onEnd();
    setActive(false);
  }, [onEnd]);

  // Delay the end of counting - for UX purposes only
  useEffect(() => {
    if (isEnd && status) {
      console.log('end timer here', isEnd, status);

      const id = setTimeout(handleEndTimer, 1000);
      return () => clearTimeout(id);
    }
  }, [handleEndTimer, isEnd, status]);

  const final = isEnd && !active;
  const CircularProgressbarStyle = `${
    final ? 'hide' : ''
  } timerchart-circular-progressbar`;

  return (
    <>
      <TxProgressWrapper
        className={`txProgress-wrapper ${className}`}
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
                textColor: '#23DCC8',
                textSize: '14px',
                pathColor: '#23DCC8',
                trailColor: 'rgba(242, 243, 243, 0.5)',
                pathTransition: 'stroke-dashoffset 0.5s linear 0s',
              })}
            />
          </>
        )}
      </TxProgressWrapper>
    </>
  );
};

export default TxProgress;
